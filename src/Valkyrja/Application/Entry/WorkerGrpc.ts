/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ChildContainer } from '../../Container/Manager/ChildContainer.ts';
import { ContainerServiceId } from '../../Container/Constant/ContainerServiceId.ts';
import { ServiceResponse } from '../../Grpc/Message/Response/ServiceResponse.ts';
import { GrpcRoutingServiceId } from '../../Grpc/Routing/Constant/GrpcRoutingServiceId.ts';
import { GrpcServerServiceId } from '../../Grpc/Server/Constant/GrpcServerServiceId.ts';
import { ApplicationServiceId } from '../Constant/ApplicationServiceId.ts';
import { ChildApplication } from '../Kernel/ChildApplication.ts';
import { App } from './Abstract/App.ts';

import type { ContainerData } from '../../Container/Data/ContainerData.ts';
import type { ContainerContract } from '../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceCallContract } from '../../Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { OutboundSink } from '../../Grpc/Message/Call/ServiceCall.ts';
import type { ServiceResponseContract } from '../../Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { OutboundStreamContract } from '../../Grpc/Message/Stream/Contract/OutboundStreamContract.ts';
import type { RouteCollectionContract } from '../../Grpc/Routing/Collection/Contract/RouteCollectionContract.ts';
import type { ServiceHandlerContract } from '../../Grpc/Server/Handler/Contract/ServiceHandlerContract.ts';
import type { GrpcConfigContract } from '../Data/Contract/GrpcConfigContract.ts';
import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';

/**
 * gRPC entry point for persistent worker runtimes (`@grpc/grpc-js`, and any other transport an
 * adapter bridges).
 *
 * {@link WorkerGrpc.bootstrap} performs the full application bootstrap once at worker startup and
 * force-resolves the service map so it lives in the frozen parent container.
 * {@link WorkerGrpc.dispatch} creates an isolated child container per call so state never bleeds
 * between calls; the adapter's `writer` runs between `SendingResponse` and `ResponseSent`, matching
 * the wire order.
 *
 * All methods are static so the lifecycle can be reproduced without extending this class.
 */
export class WorkerGrpc extends App {
    /** Bootstrap the application once at worker startup. */
    static bootstrap(config: GrpcConfigContract): ApplicationContract {
        const app = this.start(config);
        const container = app.getContainer();

        this.bootstrapThrowableHandler(app, container);
        this.bootstrapParentServices(app);

        return app;
    }

    /**
     * Handle a single buffered call using an isolated child container.
     *
     * Resolves the service handler, runs the pipeline through `SendingResponse`, hands the response
     * to `writer` to write to the wire, then runs `ResponseSent`.
     */
    static async dispatch(
        app: ApplicationContract,
        data: ContainerData,
        call: ServiceCallContract,
        writer: (response: ServiceResponseContract) => void | Promise<void>,
    ): Promise<void> {
        const handler = this.getCallHandler(app, data);

        let response = await handler.handle(call);

        response = await handler.sending(call, response);

        try {
            await writer(response);
        } finally {
            // ResponseSent middleware must run even when the wire write blows up, so per-call
            // resources are released and observers still see the call complete.
            await handler.terminate(call, response);
        }
    }

    /**
     * Handle a single streaming-model (bidirectional) call. Unlike {@link WorkerGrpc.dispatch}, the
     * handler is invoked immediately (not after half-close) and emits messages through the call's
     * push sink while it reads live inbound; the adapter runs this as a per-call task.
     *
     * The pipeline still runs once per call: `SendingResponse` fires once at stream open (the first
     * emit, or the close when the handler emits nothing) against an OK shell whose initial metadata
     * becomes the response headers; the handler's returned terminal response supplies the final
     * status and trailing metadata; and `ResponseSent` fires once at close.
     */
    static async dispatchStreaming(
        app: ApplicationContract,
        data: ContainerData,
        callFactory: (sink: OutboundSink) => ServiceCallContract,
        outbound: OutboundStreamContract,
    ): Promise<void> {
        const handler = this.getCallHandler(app, data);

        let opened = false;
        let call: ServiceCallContract | null = null;

        const openStream = async (): Promise<void> => {
            if (opened) {
                return;
            }

            opened = true;

            // `SendingResponse` governs the headers; at open the final status is unknown, so it runs
            // against an OK shell whose initial metadata is sent as the response headers.
            const shell = await handler.sending(call as ServiceCallContract, ServiceResponse.ok());

            outbound.sendHeaders(shell.getInitialMetadata());
        };

        // `send` is synchronous but opening the stream is not, so every emit is appended to a single
        // chain rather than each racing its own `openStream()`. Without the chain the first emit
        // waits on the `SendingResponse` stage while a later one — seeing the stream already
        // opening — resolves in a single tick and reaches the wire first, reordering the stream.
        let sends: Promise<void> = Promise.resolve();

        // `call` is assigned before the handler — and thus any emit — can run.
        call = callFactory((message) => {
            sends = sends.then(async () => {
                await openStream();

                outbound.sendMessage(message);
            });
        });

        const terminal = await handler.handle(call);

        // Drain any emit still queued behind the handler's return before closing the call.
        await sends;

        // Open the stream once even if the handler emitted nothing, so SendingResponse always fires
        // before the close and the open/close pairing stays symmetric.
        await openStream();

        try {
            outbound.close(terminal);
        } finally {
            await handler.terminate(call, terminal);
        }
    }

    /** Resolve the call-scoped service handler from a fresh child container. */
    static getCallHandler(app: ApplicationContract, data: ContainerData): ServiceHandlerContract {
        const childContainer = this.getChildContainer(app, data);
        const childApp = this.getChildApplication(app, childContainer);

        this.bootstrapChildContainer(childApp, childContainer);

        return childContainer.getSingleton<ServiceHandlerContract>(GrpcServerServiceId.ServiceHandlerContract);
    }

    /** Get a child application scoped to the current call. */
    static getChildApplication(app: ApplicationContract, container: ContainerContract): ApplicationContract {
        return new ChildApplication(app, container);
    }

    /** Get a child container scoped to the current call. */
    static getChildContainer(app: ApplicationContract, data: ContainerData): ContainerContract {
        return new ChildContainer(app.getContainer(), data);
    }

    /** Bootstrap a child container with the call-scoped singletons. */
    static bootstrapChildContainer(app: ApplicationContract, container: ContainerContract): void {
        container.setSingleton(ApplicationServiceId.ApplicationContract, app);
        container.setSingleton(ContainerServiceId.Contract, container);
    }

    /** Force-resolve the service map so it is cached in the frozen parent rather than rebuilt per call. */
    static bootstrapParentServices(app: ApplicationContract): void {
        app.getContainer().getSingleton<RouteCollectionContract>(GrpcRoutingServiceId.RouteCollectionContract);
    }
}

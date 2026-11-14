/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcMessageServiceId } from '../../Message/Constant/GrpcMessageServiceId.ts';
import { ServiceResponse } from '../../Message/Response/ServiceResponse.ts';
import { Status } from '../../Message/Status/Status.ts';
import { Cancellation } from '../../Support/Cancellation.ts';
import { CancelledException } from '../../Throwable/Exception/CancelledException.ts';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { CallReceivedHandlerContract } from '../../Middleware/Handler/Contract/CallReceivedHandlerContract.ts';
import type { ResponseSentHandlerContract } from '../../Middleware/Handler/Contract/ResponseSentHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../../Middleware/Handler/Contract/SendingResponseHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouterContract } from '../../Routing/Dispatcher/Contract/RouterContract.ts';
import type { ServiceHandlerContract } from './Contract/ServiceHandlerContract.ts';

export class ServiceHandler implements ServiceHandlerContract {
    constructor(
        protected container: ContainerContract,
        protected router: RouterContract,
        protected callReceivedHandler: CallReceivedHandlerContract,
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract,
        protected sendingResponseHandler: SendingResponseHandlerContract,
        protected responseSentHandler: ResponseSentHandlerContract,
        protected debug: boolean = false,
    ) {}

    async handle(call: ServiceCallContract): Promise<ServiceResponseContract> {
        let response: ServiceResponseContract;

        try {
            response = await this.dispatchRouter(call);
        } catch (throwable) {
            response = this.getResponseFromThrowable(throwable);
            response = await this.throwableCaughtHandler.throwableCaught(call, response, throwable);
        }

        this.container.setSingleton<ServiceResponseContract>(GrpcMessageServiceId.ServiceResponseContract, response);

        return response;
    }

    async sending(call: ServiceCallContract, response: ServiceResponseContract): Promise<ServiceResponseContract> {
        const sent = await this.sendingResponseHandler.sendingResponse(call, response);

        this.container.setSingleton<ServiceResponseContract>(GrpcMessageServiceId.ServiceResponseContract, sent);

        return sent;
    }

    async terminate(call: ServiceCallContract, response: ServiceResponseContract): Promise<void> {
        await this.responseSentHandler.responseSent(call, response);
    }

    async run(call: ServiceCallContract): Promise<ServiceResponseContract> {
        return this.sending(call, await this.handle(call));
    }

    protected async dispatchRouter(call: ServiceCallContract): Promise<ServiceResponseContract> {
        this.container.setSingleton<ServiceCallContract>(GrpcMessageServiceId.ServiceCallContract, call);

        const cancelled = Cancellation.checkAndFinalize(call);

        if (cancelled !== null) {
            return cancelled;
        }

        const received = await this.callReceivedHandler.callReceived(call);

        if (received.response !== null) {
            return received.response;
        }

        const processedCall = received.call;

        this.container.setSingleton<ServiceCallContract>(GrpcMessageServiceId.ServiceCallContract, processedCall);

        return this.router.dispatch(processedCall);
    }

    protected getResponseFromThrowable(throwable: unknown): ServiceResponseContract {
        if (this.debug) {
            throw throwable;
        }

        if (throwable instanceof CancelledException) {
            return ServiceResponse.cancelled(throwable.getReason());
        }

        return ServiceResponse.of(Status.internal());
    }
}

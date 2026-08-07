/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { GrpcConfig } from '../../../../../src/Valkyrja/Application/Data/GrpcConfig.ts';
import { Directory } from '../../../../../src/Valkyrja/Application/Directory/Directory.ts';
import { WorkerGrpc } from '../../../../../src/Valkyrja/Application/Entry/WorkerGrpc.ts';
import { GrpcApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/GrpcApplicationComponentProvider.ts';
import { StatusCode } from '../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { Metadata } from '../../../../../src/Valkyrja/Grpc/Message/Metadata/Metadata.ts';
import { ServiceCall } from '../../../../../src/Valkyrja/Grpc/Message/Call/ServiceCall.ts';
import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Deadline } from '../../../../../src/Valkyrja/Grpc/Message/Deadline/Deadline.ts';
import { CancellationToken } from '../../../../../src/Valkyrja/Grpc/Message/Cancellation/CancellationToken.ts';
import { Peer } from '../../../../../src/Valkyrja/Grpc/Message/Peer/Peer.ts';
import { GrpcRoutingServiceId } from '../../../../../src/Valkyrja/Grpc/Routing/Constant/GrpcRoutingServiceId.ts';
import { Route } from '../../../../../src/Valkyrja/Grpc/Routing/Data/Route.ts';
import { OutboundStreamFixture } from '../../../Fixtures/Grpc/Message/OutboundStreamFixture.ts';
import { RecordingResponseSentMiddlewareFixture } from '../../../Fixtures/Grpc/Middleware/RecordingResponseSentMiddlewareFixture.ts';
import {
    DECORATED_METHOD,
    PING_METHOD,
    PingComponentProviderFixture,
} from '../../../Fixtures/Grpc/PingComponentProviderFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerData } from '../../../../../src/Valkyrja/Container/Data/ContainerData.ts';
import type { ServiceCallContract } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../../../src/Valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteContract } from '../../../../../src/Valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';
import type { GrpcRouteProviderContract } from '../../../../../src/Valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';
import type { ComponentProviderContract } from '../../../../../src/Valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';
import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { ListenerProviderContract } from '../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { CliRouteProviderContract } from '../../../../../src/Valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { HttpRouteProviderContract } from '../../../../../src/Valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

const STREAM_METHOD = '/test.Ping/Echo';

class EchoComponentProviderFixture implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [];
    }

    getGrpcProviders(_app: ApplicationContract): GrpcRouteProviderContract[] {
        return [
            {
                getRoutes: (): RouteContract[] => [
                    new Route(STREAM_METHOD, (container): Promise<ServiceResponseContract> => {
                        const call = container.getSingleton<ServiceCallContract>(
                            'Valkyrja.Grpc.Message.Call.ServiceCallContract',
                        );

                        call.send('one');
                        call.send('two');
                        call.send('three');

                        return Promise.resolve(ServiceResponse.ok());
                    })
                        .withClientStreaming(true)
                        .withServerStreaming(true),
                ],
            },
        ];
    }
}

const configWith = (...providers: ComponentProviderContract[]): GrpcConfig =>
    new GrpcConfig(
        'App',
        process.cwd(),
        '1.0.0',
        'production',
        false,
        'UTC',
        'some_secret_app_key',
        'App/Provider/Data',
        'App/Provider/Data',
        50051,
        1000,
        [new GrpcApplicationComponentProvider(), ...providers],
    );

const boot = (...providers: ComponentProviderContract[]): { app: ApplicationContract; data: ContainerData } => {
    const app = WorkerGrpc.bootstrap(configWith(...providers));

    return { app, data: app.getContainer().getData() };
};

describe('WorkerGrpc (functional)', () => {
    beforeEach(() => {
        WorkerGrpc.directory(Directory.basePath);
        RecordingResponseSentMiddlewareFixture.sent.length = 0;
    });

    it('force-resolves the service map into the frozen parent at bootstrap', () => {
        const { app } = boot(new PingComponentProviderFixture());

        expect(app.getContainer().has(GrpcRoutingServiceId.RouteCollectionContract)).toBe(true);
    });

    it('dispatches a buffered call and writes the response between sending and ResponseSent', async () => {
        const { app, data } = boot(new PingComponentProviderFixture());
        const written: ServiceResponseContract[] = [];

        await WorkerGrpc.dispatch(app, data, ServiceCall.unary(PING_METHOD, 'ping'), (response) => {
            written.push(response);
        });

        expect(written).toHaveLength(1);
        expect(written[0]?.getStatus().getCode()).toBe(StatusCode.OK);
        expect([...(written[0] as ServiceResponseContract).getMessages()]).toEqual(['pong']);
    });

    it('runs ResponseSent even when the wire write throws', async () => {
        const { app, data } = boot(new PingComponentProviderFixture());

        // The route carries `RecordingResponseSentMiddlewareFixture`, so the recorded method proves
        // `terminate` ran. Asserting only on the rejection would pass even if the `finally` that
        // guarantees it were removed.
        await expect(
            WorkerGrpc.dispatch(app, data, ServiceCall.unary(DECORATED_METHOD, 'ping'), () => {
                throw new Error('wire failed');
            }),
        ).rejects.toThrow('wire failed');

        expect(RecordingResponseSentMiddlewareFixture.sent).toContain(DECORATED_METHOD);
    });

    it('isolates each call in its own child container', () => {
        const { app, data } = boot(new PingComponentProviderFixture());
        const first = WorkerGrpc.getCallHandler(app, data);
        const second = WorkerGrpc.getCallHandler(app, data);

        expect(first).not.toBe(second);
    });

    describe('dispatchStreaming', () => {
        const streamingCall = (sink: (message: unknown) => void): ServiceCallContract =>
            new ServiceCall(
                STREAM_METHOD,
                [],
                new Metadata(),
                Deadline.none(),
                new CancellationToken(),
                Peer.insecure('unknown'),
                null,
                sink,
            );

        it('writes headers first, then every message in emission order, then closes', async () => {
            // Regression guard: `send` is synchronous while opening the stream is not, so emits must
            // be chained. Without that, the first emit waits on the SendingResponse stage while a
            // later one resolves in a single tick and overtakes it — silently reordering the wire.
            const { app, data } = boot(new EchoComponentProviderFixture());
            const outbound = new OutboundStreamFixture();

            await WorkerGrpc.dispatchStreaming(app, data, streamingCall, outbound);

            expect(outbound.sequence).toEqual(['headers', 'message:one', 'message:two', 'message:three', 'close']);
            expect(outbound.messages).toEqual(['one', 'two', 'three']);
        });

        it('opens the stream exactly once, even though three messages were emitted', async () => {
            const { app, data } = boot(new EchoComponentProviderFixture());
            const outbound = new OutboundStreamFixture();

            await WorkerGrpc.dispatchStreaming(app, data, streamingCall, outbound);

            expect(outbound.headers).toHaveLength(1);
            expect(outbound.closed).toHaveLength(1);
        });

        it('still opens the stream when the handler emits nothing, keeping open/close symmetric', async () => {
            class SilentComponentProviderFixture implements ComponentProviderContract {
                getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
                    return [];
                }

                getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
                    return [];
                }

                getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
                    return [];
                }

                getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
                    return [];
                }

                getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
                    return [];
                }

                getGrpcProviders(_app: ApplicationContract): GrpcRouteProviderContract[] {
                    return [
                        {
                            getRoutes: (): RouteContract[] => [
                                new Route(STREAM_METHOD, () => Promise.resolve(ServiceResponse.ok()))
                                    .withClientStreaming(true)
                                    .withServerStreaming(true),
                            ],
                        },
                    ];
                }
            }

            const { app, data } = boot(new SilentComponentProviderFixture());
            const outbound = new OutboundStreamFixture();

            await WorkerGrpc.dispatchStreaming(app, data, streamingCall, outbound);

            expect(outbound.sequence).toEqual(['headers', 'close']);
        });
    });
});

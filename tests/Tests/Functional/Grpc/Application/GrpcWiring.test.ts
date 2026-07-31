/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { GrpcConfig } from '../../../../../src/Valkyrja/Application/Data/GrpcConfig.ts';
import { Directory } from '../../../../../src/Valkyrja/Application/Directory/Directory.ts';
import { Grpc } from '../../../../../src/Valkyrja/Application/Entry/Grpc.ts';
import { GrpcApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/GrpcApplicationComponentProvider.ts';
import { ContainerServiceId } from '../../../../../src/Valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { StatusCode } from '../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { ServiceCall } from '../../../../../src/Valkyrja/Grpc/Message/Call/ServiceCall.ts';
import { GrpcRoutingServiceId } from '../../../../../src/Valkyrja/Grpc/Routing/Constant/GrpcRoutingServiceId.ts';
import { GrpcServerServiceId } from '../../../../../src/Valkyrja/Grpc/Server/Constant/GrpcServerServiceId.ts';
import { GrpcMiddlewareServiceId } from '../../../../../src/Valkyrja/Grpc/Middleware/Constant/GrpcMiddlewareServiceId.ts';
import {
    DECORATED_METHOD,
    PING_METHOD,
    PingComponentProviderFixture,
} from '../../../Fixtures/Grpc/PingComponentProviderFixture.ts';
import { RecordingResponseSentMiddlewareFixture } from '../../../Fixtures/Grpc/Middleware/RecordingResponseSentMiddlewareFixture.ts';
import { RespondingSendingResponseMiddlewareFixture } from '../../../Fixtures/Grpc/Middleware/RespondingSendingResponseMiddlewareFixture.ts';

const pingConfig = (): GrpcConfig =>
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
        [new GrpcApplicationComponentProvider(), new PingComponentProviderFixture()],
    );

describe('Grpc wiring (functional)', () => {
    beforeEach(() => {
        Grpc.directory(Directory.basePath);
        RecordingResponseSentMiddlewareFixture.sent.length = 0;
    });

    it('boots a gRPC application and registers the core services', () => {
        const app = Grpc.app(new GrpcConfig());
        const container = app.getContainer();

        expect(container).toBeInstanceOf(Container);
        expect(container.has(ApplicationServiceId.GrpcConfigContract)).toBe(true);
        expect(container.has(ApplicationServiceId.HttpConfigContract)).toBe(false);
        expect(container.has(ContainerServiceId.Contract)).toBe(true);
        expect(container.has(ApplicationServiceId.ApplicationContract)).toBe(true);
        expect(container.has(GrpcServerServiceId.ServiceHandlerContract)).toBe(true);
        expect(container.has(GrpcRoutingServiceId.RouterContract)).toBe(true);
        expect(container.has(GrpcRoutingServiceId.RouteCollectionContract)).toBe(true);
        expect(container.has(GrpcMiddlewareServiceId.CallReceivedHandlerContract)).toBe(true);
    });

    it('dispatches a unary call end to end through the whole pipeline', async () => {
        const response = await Grpc.handle(pingConfig(), ServiceCall.unary(PING_METHOD, 'ping'));

        expect(response.getStatus().getCode()).toBe(StatusCode.OK);
        expect([...response.getMessages()]).toEqual(['pong']);
    });

    it('answers UNIMPLEMENTED for a method the service map does not hold', async () => {
        const response = await Grpc.handle(pingConfig(), ServiceCall.unary('/test.Ping/Unknown', 'ping'));

        expect(response.getStatus().getCode()).toBe(StatusCode.UNIMPLEMENTED);
    });

    it('collects routes from every registered gRPC route provider', () => {
        const app = Grpc.app(pingConfig());
        const collection = app.getContainer().getSingleton(GrpcRoutingServiceId.RouteCollectionContract);

        expect(app.getGrpcProviders()).toHaveLength(1);
        expect([...(collection as { all(): Map<string, unknown> }).all().keys()]).toEqual([
            PING_METHOD,
            DECORATED_METHOD,
        ]);
    });

    it('fires per-route SendingResponse and ResponseSent middleware', async () => {
        // The Router registers these onto the stage handlers, and the ServiceHandler is what invokes
        // them — so this only passes while both resolve the same container singletons. If the
        // providers stop publishing them as singletons, per-route always-run middleware silently
        // never fires and nothing else in the suite notices.
        const response = await Grpc.handle(pingConfig(), ServiceCall.unary(DECORATED_METHOD, 'ping'));

        expect(response).toBe(RespondingSendingResponseMiddlewareFixture.response);
        expect(RecordingResponseSentMiddlewareFixture.sent).toEqual([DECORATED_METHOD]);
    });
});

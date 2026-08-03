/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Valkyrja } from '../../../../../../src/Valkyrja/Application/Kernel/Valkyrja.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { GrpcMiddlewareServiceProvider } from '../../../../../../src/Valkyrja/Grpc/Middleware/Provider/GrpcMiddlewareServiceProvider.ts';
import { GrpcRoutingServiceProvider } from '../../../../../../src/Valkyrja/Grpc/Routing/Provider/GrpcRoutingServiceProvider.ts';
import { GrpcServerServiceId } from '../../../../../../src/Valkyrja/Grpc/Server/Constant/GrpcServerServiceId.ts';
import { ServiceHandler } from '../../../../../../src/Valkyrja/Grpc/Server/Handler/ServiceHandler.ts';
import { GrpcServerComponentProvider } from '../../../../../../src/Valkyrja/Grpc/Server/Provider/GrpcServerComponentProvider.ts';
import { GrpcServerServiceProvider } from '../../../../../../src/Valkyrja/Grpc/Server/Provider/GrpcServerServiceProvider.ts';
import { GrpcConfigFixture } from '../../../../Fixtures/Grpc/GrpcConfigFixture.ts';

const bootedContainer = (): Container => {
    const container = new Container();
    // Debug mode, so the collection is built from the providers rather than from a generated
    // `GrpcRoutingData` this test never produces.
    const config = GrpcConfigFixture.withDebugMode(true);
    const app = new Valkyrja(container, config);

    container.setSingleton(ApplicationServiceId.ApplicationContract, app);
    container.setSingleton(ApplicationServiceId.GrpcConfigContract, config);

    for (const publish of Object.values(new GrpcMiddlewareServiceProvider().publishers())) {
        publish(container);
    }

    GrpcRoutingServiceProvider.publishRouteCollection(container);
    GrpcRoutingServiceProvider.publishRouter(container);

    return container;
};

describe('GrpcServerServiceProvider', () => {
    it('publishes the service handler', () => {
        expect(Object.keys(new GrpcServerServiceProvider().publishers())).toHaveLength(1);
    });

    it('publishes the kernel wired to the shared stage handlers', () => {
        const container = bootedContainer();

        GrpcServerServiceProvider.publishServiceHandler(container);

        expect(container.getSingleton(GrpcServerServiceId.ServiceHandlerContract)).toBeInstanceOf(ServiceHandler);
    });
});

describe('GrpcServerComponentProvider', () => {
    it('contributes only its service provider', () => {
        const app = new Valkyrja(new Container(), new GrpcConfigFixture());
        const provider = new GrpcServerComponentProvider();

        const containerProviders = provider.getContainerProviders(app);

        expect(containerProviders).toHaveLength(1);
        expect(containerProviders[0]).toBeInstanceOf(GrpcServerServiceProvider);
        expect(provider.getComponentProviders(app)).toEqual([]);
        expect(provider.getEventProviders(app)).toEqual([]);
        expect(provider.getCliProviders(app)).toEqual([]);
        expect(provider.getHttpProviders(app)).toEqual([]);
        expect(provider.getGrpcProviders(app)).toEqual([]);
    });
});

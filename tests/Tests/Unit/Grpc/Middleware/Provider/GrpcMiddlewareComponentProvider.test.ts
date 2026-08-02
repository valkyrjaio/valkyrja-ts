/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { Valkyrja } from '../../../../../../src/Valkyrja/Application/Kernel/Valkyrja.ts';
import { GrpcMiddlewareComponentProvider } from '../../../../../../src/Valkyrja/Grpc/Middleware/Provider/GrpcMiddlewareComponentProvider.ts';
import { GrpcMiddlewareServiceProvider } from '../../../../../../src/Valkyrja/Grpc/Middleware/Provider/GrpcMiddlewareServiceProvider.ts';
import { GrpcConfigFixture } from '../../../../Fixtures/Grpc/GrpcConfigFixture.ts';

describe('GrpcMiddlewareComponentProvider', () => {
    it('contributes only its service provider', () => {
        const app = new Valkyrja(new Container(), new GrpcConfigFixture());
        const provider = new GrpcMiddlewareComponentProvider();

        const containerProviders = provider.getContainerProviders(app);

        expect(containerProviders).toHaveLength(1);
        expect(containerProviders[0]).toBeInstanceOf(GrpcMiddlewareServiceProvider);
        expect(provider.getComponentProviders(app)).toEqual([]);
        expect(provider.getEventProviders(app)).toEqual([]);
        expect(provider.getCliProviders(app)).toEqual([]);
        expect(provider.getHttpProviders(app)).toEqual([]);
        expect(provider.getGrpcProviders(app)).toEqual([]);
    });
});

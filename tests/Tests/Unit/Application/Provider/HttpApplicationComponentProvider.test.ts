/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HttpApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/HttpApplicationComponentProvider.ts';
import { ContainerComponentProvider } from '../../../../../src/Valkyrja/Container/Provider/ContainerComponentProvider.ts';
import { HttpMessageComponentProvider } from '../../../../../src/Valkyrja/Http/Message/Provider/HttpMessageComponentProvider.ts';
import { HttpMiddlewareComponentProvider } from '../../../../../src/Valkyrja/Http/Middleware/Provider/HttpMiddlewareComponentProvider.ts';
import { HttpRoutingCliComponentProvider } from '../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingCliComponentProvider.ts';
import { HttpRoutingComponentProvider } from '../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingComponentProvider.ts';
import { HttpServerComponentProvider } from '../../../../../src/Valkyrja/Http/Server/Provider/HttpServerComponentProvider.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('HttpApplicationComponentProvider', () => {
    it('getComponentProviders returns the http serving component providers', () => {
        const providers = new HttpApplicationComponentProvider().getComponentProviders(app);

        expect(providers).toHaveLength(6);
        expect(providers[0]).toBeInstanceOf(ContainerComponentProvider);
        expect(providers[1]).toBeInstanceOf(HttpMessageComponentProvider);
        expect(providers[2]).toBeInstanceOf(HttpMiddlewareComponentProvider);
        expect(providers[3]).toBeInstanceOf(HttpRoutingComponentProvider);
        expect(providers[4]).toBeInstanceOf(HttpRoutingCliComponentProvider);
        expect(providers[5]).toBeInstanceOf(HttpServerComponentProvider);
    });

    it('getContainerProviders is empty', () => {
        expect(new HttpApplicationComponentProvider().getContainerProviders(app)).toHaveLength(0);
    });

    it('getEventProviders is empty', () => {
        expect(new HttpApplicationComponentProvider().getEventProviders(app)).toHaveLength(0);
    });

    it('getCliProviders is empty', () => {
        expect(new HttpApplicationComponentProvider().getCliProviders(app)).toHaveLength(0);
    });

    it('getHttpProviders is empty', () => {
        expect(new HttpApplicationComponentProvider().getHttpProviders(app)).toHaveLength(0);
    });

    it('getGrpcProviders is empty', () => {
        expect(new HttpApplicationComponentProvider().getGrpcProviders(app)).toHaveLength(0);
    });
});

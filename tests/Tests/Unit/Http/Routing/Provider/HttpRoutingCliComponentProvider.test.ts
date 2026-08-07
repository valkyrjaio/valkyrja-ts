/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HttpRoutingCliComponentProvider } from '../../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingCliComponentProvider.ts';
import { HttpRoutingCliRouteProvider } from '../../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingCliRouteProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('HttpRoutingCliComponentProvider', () => {
    const provider = new HttpRoutingCliComponentProvider();

    it('provides the http routing cli route provider', () => {
        expect(provider.getCliProviders(app)[0]).toBeInstanceOf(HttpRoutingCliRouteProvider);
    });

    it('returns no component, container, event, http, or grpc providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getContainerProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
        expect(provider.getGrpcProviders(app)).toHaveLength(0);
    });
});

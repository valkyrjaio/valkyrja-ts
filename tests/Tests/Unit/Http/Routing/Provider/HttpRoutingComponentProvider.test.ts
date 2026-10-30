/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HttpRoutingComponentProvider } from '../../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingComponentProvider.ts';
import { HttpRoutingServiceProvider } from '../../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingServiceProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('HttpRoutingComponentProvider', () => {
    const provider = new HttpRoutingComponentProvider();

    it('wires the routing service provider', () => {
        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(HttpRoutingServiceProvider);
    });

    it('returns no component, event, cli, http, or grpc providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
        expect(provider.getGrpcProviders(app)).toHaveLength(0);
    });
});

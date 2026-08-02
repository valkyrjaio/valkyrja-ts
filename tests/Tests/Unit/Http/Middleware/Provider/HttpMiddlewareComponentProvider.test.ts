/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HttpMiddlewareComponentProvider } from '../../../../../../src/Valkyrja/Http/Middleware/Provider/HttpMiddlewareComponentProvider.ts';
import { HttpMiddlewareServiceProvider } from '../../../../../../src/Valkyrja/Http/Middleware/Provider/HttpMiddlewareServiceProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('HttpMiddlewareComponentProvider', () => {
    const provider = new HttpMiddlewareComponentProvider();

    it('wires the middleware service provider', () => {
        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(HttpMiddlewareServiceProvider);
    });

    it('returns no component, event, cli, or http providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });
});

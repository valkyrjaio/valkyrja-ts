/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliMiddlewareComponentProvider } from '../../../../../../src/Valkyrja/Cli/Middleware/Provider/CliMiddlewareComponentProvider.ts';
import { CliMiddlewareServiceProvider } from '../../../../../../src/Valkyrja/Cli/Middleware/Provider/CliMiddlewareServiceProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('CliMiddlewareComponentProvider', () => {
    const provider = new CliMiddlewareComponentProvider();

    it('wires the middleware service provider', () => {
        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(CliMiddlewareServiceProvider);
    });

    it('returns no component, event, cli, or http providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });
});

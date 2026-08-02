/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HttpMessageComponentProvider } from '../../../../../../src/Valkyrja/Http/Message/Provider/HttpMessageComponentProvider.ts';
import { HttpMessageServiceProvider } from '../../../../../../src/Valkyrja/Http/Message/Provider/HttpMessageServiceProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('HttpMessageComponentProvider', () => {
    const provider = new HttpMessageComponentProvider();

    it('wires the message service provider', () => {
        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(HttpMessageServiceProvider);
    });

    it('returns no component, event, cli, http, or grpc providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
        expect(provider.getGrpcProviders(app)).toHaveLength(0);
    });
});

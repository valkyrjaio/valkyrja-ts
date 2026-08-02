/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliServerComponentProvider } from '../../../../../../src/Valkyrja/Cli/Server/Provider/CliServerComponentProvider.ts';
import { CliServerServiceProvider } from '../../../../../../src/Valkyrja/Cli/Server/Provider/CliServerServiceProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('CliServerComponentProvider', () => {
    const provider = new CliServerComponentProvider();

    it('wires the server service provider', () => {
        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(CliServerServiceProvider);
    });

    it('returns no component, event, cli, http, or grpc providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
        expect(provider.getGrpcProviders(app)).toHaveLength(0);
    });
});

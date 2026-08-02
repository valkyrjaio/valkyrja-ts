/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliInteractionComponentProvider } from '../../../../../../src/Valkyrja/Cli/Interaction/Provider/CliInteractionComponentProvider.ts';
import { CliInteractionServiceProvider } from '../../../../../../src/Valkyrja/Cli/Interaction/Provider/CliInteractionServiceProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('CliInteractionComponentProvider', () => {
    const provider = new CliInteractionComponentProvider();

    it('returns the interaction service provider as its only container provider', () => {
        const providers = provider.getContainerProviders(app);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(CliInteractionServiceProvider);
    });

    it('returns no component, event, cli, or http providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });
});

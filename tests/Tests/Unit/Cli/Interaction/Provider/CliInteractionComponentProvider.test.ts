/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

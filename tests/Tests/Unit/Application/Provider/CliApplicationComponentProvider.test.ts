/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/CliApplicationComponentProvider.ts';
import { CliInteractionComponentProvider } from '../../../../../src/Valkyrja/Cli/Interaction/Provider/CliInteractionComponentProvider.ts';
import { CliMiddlewareComponentProvider } from '../../../../../src/Valkyrja/Cli/Middleware/Provider/CliMiddlewareComponentProvider.ts';
import { CliRoutingComponentProvider } from '../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingComponentProvider.ts';
import { CliServerComponentProvider } from '../../../../../src/Valkyrja/Cli/Server/Provider/CliServerComponentProvider.ts';
import { ContainerComponentProvider } from '../../../../../src/Valkyrja/Container/Provider/ContainerComponentProvider.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('CliApplicationComponentProvider', () => {
    it('getComponentProviders returns the CLI component providers', () => {
        const providers = new CliApplicationComponentProvider().getComponentProviders(app);

        expect(providers).toHaveLength(5);
        expect(providers[0]).toBeInstanceOf(ContainerComponentProvider);
        expect(providers[1]).toBeInstanceOf(CliInteractionComponentProvider);
        expect(providers[2]).toBeInstanceOf(CliMiddlewareComponentProvider);
        expect(providers[3]).toBeInstanceOf(CliRoutingComponentProvider);
        expect(providers[4]).toBeInstanceOf(CliServerComponentProvider);
    });

    it('getContainerProviders is empty', () => {
        expect(new CliApplicationComponentProvider().getContainerProviders(app)).toHaveLength(0);
    });

    it('getEventProviders is empty', () => {
        expect(new CliApplicationComponentProvider().getEventProviders(app)).toHaveLength(0);
    });

    it('getCliProviders is empty', () => {
        expect(new CliApplicationComponentProvider().getCliProviders(app)).toHaveLength(0);
    });

    it('getHttpProviders is empty', () => {
        expect(new CliApplicationComponentProvider().getHttpProviders(app)).toHaveLength(0);
    });
});

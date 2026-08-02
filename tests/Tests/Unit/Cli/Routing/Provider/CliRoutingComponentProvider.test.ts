/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliRoutingCliRouteProvider } from '../../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingCliRouteProvider.ts';
import { CliRoutingComponentProvider } from '../../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingComponentProvider.ts';
import { CliRoutingServiceProvider } from '../../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingServiceProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('CliRoutingComponentProvider', () => {
    const provider = new CliRoutingComponentProvider();

    it('wires the routing service and route providers', () => {
        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(CliRoutingServiceProvider);
        expect(provider.getCliProviders(app)[0]).toBeInstanceOf(CliRoutingCliRouteProvider);
    });

    it('returns no component, event, or http providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });
});

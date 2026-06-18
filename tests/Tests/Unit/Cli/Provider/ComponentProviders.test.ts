/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliMiddlewareComponentProvider } from '../../../../../src/Valkyrja/Cli/Middleware/Provider/CliMiddlewareComponentProvider.ts';
import { CliMiddlewareServiceProvider } from '../../../../../src/Valkyrja/Cli/Middleware/Provider/CliMiddlewareServiceProvider.ts';
import { CliRoutingCliRouteProvider } from '../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingCliRouteProvider.ts';
import { CliRoutingComponentProvider } from '../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingComponentProvider.ts';
import { CliRoutingServiceProvider } from '../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingServiceProvider.ts';
import { CliServerComponentProvider } from '../../../../../src/Valkyrja/Cli/Server/Provider/CliServerComponentProvider.ts';
import { CliServerServiceProvider } from '../../../../../src/Valkyrja/Cli/Server/Provider/CliServerServiceProvider.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('Cli component providers', () => {
    it('CliRoutingComponentProvider wires the routing service and route providers', () => {
        const provider = new CliRoutingComponentProvider();

        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(CliRoutingServiceProvider);
        expect(provider.getCliProviders(app)[0]).toBeInstanceOf(CliRoutingCliRouteProvider);
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });

    it('CliMiddlewareComponentProvider wires the middleware service provider', () => {
        const provider = new CliMiddlewareComponentProvider();

        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(CliMiddlewareServiceProvider);
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });

    it('CliServerComponentProvider wires the server service provider', () => {
        const provider = new CliServerComponentProvider();

        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(CliServerServiceProvider);
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });
});

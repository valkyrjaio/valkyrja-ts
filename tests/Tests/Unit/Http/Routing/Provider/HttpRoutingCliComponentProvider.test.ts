/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HttpRoutingCliComponentProvider } from '../../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingCliComponentProvider.ts';
import { HttpRoutingCliRouteProvider } from '../../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingCliRouteProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('HttpRoutingCliComponentProvider', () => {
    const provider = new HttpRoutingCliComponentProvider();

    it('provides the http routing cli route provider', () => {
        expect(provider.getCliProviders(app)[0]).toBeInstanceOf(HttpRoutingCliRouteProvider);
    });

    it('returns no component, container, event, or http providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getContainerProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

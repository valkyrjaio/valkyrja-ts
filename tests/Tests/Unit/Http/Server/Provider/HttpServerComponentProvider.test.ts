/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HttpServerComponentProvider } from '../../../../../../src/Valkyrja/Http/Server/Provider/HttpServerComponentProvider.ts';
import { HttpServerServiceProvider } from '../../../../../../src/Valkyrja/Http/Server/Provider/HttpServerServiceProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('HttpServerComponentProvider', () => {
    const provider = new HttpServerComponentProvider();

    it('wires the server service provider', () => {
        expect(provider.getContainerProviders(app)[0]).toBeInstanceOf(HttpServerServiceProvider);
    });

    it('returns no component, event, cli, or http providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });
});

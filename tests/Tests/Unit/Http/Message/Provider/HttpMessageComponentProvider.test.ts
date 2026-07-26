/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

    it('returns no component, event, cli, or http providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });
});

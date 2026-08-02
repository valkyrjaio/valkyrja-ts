/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

    it('returns no component, event, cli, or http providers', () => {
        expect(provider.getComponentProviders(app)).toHaveLength(0);
        expect(provider.getEventProviders(app)).toHaveLength(0);
        expect(provider.getCliProviders(app)).toHaveLength(0);
        expect(provider.getHttpProviders(app)).toHaveLength(0);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ContainerComponentProvider } from '../../../../../src/Valkyrja/Container/Provider/ContainerComponentProvider.ts';
import { ContainerServiceProvider } from '../../../../../src/Valkyrja/Container/Provider/ContainerServiceProvider.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('ContainerComponentProvider', () => {
    it('getComponentProviders is empty', () => {
        expect(new ContainerComponentProvider().getComponentProviders(app)).toHaveLength(0);
    });

    it('getContainerProviders returns the container service provider', () => {
        const providers = new ContainerComponentProvider().getContainerProviders(app);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(ContainerServiceProvider);
    });

    it('getEventProviders is empty', () => {
        expect(new ContainerComponentProvider().getEventProviders(app)).toHaveLength(0);
    });

    it('getCliProviders is empty', () => {
        expect(new ContainerComponentProvider().getCliProviders(app)).toHaveLength(0);
    });

    it('getHttpProviders is empty', () => {
        expect(new ContainerComponentProvider().getHttpProviders(app)).toHaveLength(0);
    });
});

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HttpApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/HttpApplicationComponentProvider.ts';
import { ContainerComponentProvider } from '../../../../../src/Valkyrja/Container/Provider/ContainerComponentProvider.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('HttpApplicationComponentProvider', () => {
    it('getComponentProviders returns the container component provider', () => {
        const providers = new HttpApplicationComponentProvider().getComponentProviders(app);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(ContainerComponentProvider);
    });

    it('getContainerProviders is empty', () => {
        expect(new HttpApplicationComponentProvider().getContainerProviders(app)).toHaveLength(0);
    });

    it('getEventProviders is empty', () => {
        expect(new HttpApplicationComponentProvider().getEventProviders(app)).toHaveLength(0);
    });

    it('getCliProviders is empty', () => {
        expect(new HttpApplicationComponentProvider().getCliProviders(app)).toHaveLength(0);
    });

    it('getHttpProviders is empty', () => {
        expect(new HttpApplicationComponentProvider().getHttpProviders(app)).toHaveLength(0);
    });
});

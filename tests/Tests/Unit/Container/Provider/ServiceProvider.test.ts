/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { ContainerServiceId } from '../../../../../src/Valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { ContainerServiceProvider } from '../../../../../src/Valkyrja/Container/Provider/ContainerServiceProvider.ts';

import { ProviderClass } from '../../../Fixtures/Container/Provider/ProviderClass.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

describe('ContainerServiceProvider', () => {
    it('publishes the container data id', () => {
        const publishers = new ContainerServiceProvider().publishers();

        expect(ContainerServiceId.Data in publishers).toBe(true);
        expect(typeof publishers[ContainerServiceId.Data]).toBe('function');
    });

    it('publishData stores the container data as a singleton', () => {
        const container = new Container();
        const app = { getContainerProviders: () => [] } as unknown as ApplicationContract;
        container.setSingleton(ApplicationServiceId.ApplicationContract, app);

        ContainerServiceProvider.publishData(container);

        expect(container.isSingletonInstance(ContainerServiceId.Data)).toBe(true);
    });

    it('publishData registers each of the application container providers', () => {
        const container = new Container();
        const app = { getContainerProviders: () => [new ProviderClass()] } as unknown as ApplicationContract;
        container.setSingleton(ApplicationServiceId.ApplicationContract, app);

        ContainerServiceProvider.publishData(container);

        expect(container.isDeferred(ProviderClass.PROVIDED_ID)).toBe(true);
    });
});

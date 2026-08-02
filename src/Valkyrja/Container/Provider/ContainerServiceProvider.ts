/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationServiceId } from '../../Application/Constant/ApplicationServiceId.ts';
import { ContainerServiceId } from '../Constant/ContainerServiceId.ts';

import type { ApplicationContract } from '../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from './Contract/ServiceProviderContract.ts';

export class ContainerServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ContainerServiceId.Data]: ContainerServiceProvider.publishData,
        };
    }

    static publishData(this: void, container: ContainerContract): void {
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        for (const provider of app.getContainerProviders()) {
            container.register(provider);
        }

        container.setSingleton(ContainerServiceId.Data, container.getData());
    }
}

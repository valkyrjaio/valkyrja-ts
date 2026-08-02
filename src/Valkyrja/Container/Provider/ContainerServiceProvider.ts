/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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

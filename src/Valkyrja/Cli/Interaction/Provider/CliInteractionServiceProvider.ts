/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.ts';
import { CliInteractionServiceId } from '../Constant/CliInteractionServiceId.ts';
import { CliInteractionConfig } from '../Data/CliInteractionConfig.ts';
import { OutputFactory } from '../Output/Factory/OutputFactory.ts';

import { CliInteractionConfigContract } from '../Data/Contract/CliInteractionConfigContract.ts';
import type { ConfigContract } from '../../../Application/Data/Contract/ConfigContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';

export class CliInteractionServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [CliInteractionServiceId.CliInteractionConfigContract]: CliInteractionServiceProvider.publishConfig,
            [CliInteractionServiceId.OutputFactoryContract]: CliInteractionServiceProvider.publishOutputFactory,
        };
    }

    static publishConfig(this: void, container: ContainerContract): void {
        const config = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);

        if (CliInteractionConfigContract.instanceOf(config)) {
            container.setSingleton(CliInteractionServiceId.CliInteractionConfigContract, config);
            return;
        }

        container.setSingleton(CliInteractionServiceId.CliInteractionConfigContract, new CliInteractionConfig());
    }

    static publishOutputFactory(this: void, container: ContainerContract): void {
        const config = container.getSingleton<CliInteractionConfigContract>(
            CliInteractionServiceId.CliInteractionConfigContract,
        );

        container.setSingleton(CliInteractionServiceId.OutputFactoryContract, new OutputFactory(config));
    }
}

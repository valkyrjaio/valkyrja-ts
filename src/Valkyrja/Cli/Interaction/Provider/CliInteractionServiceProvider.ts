import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.js';
import { CliInteractionServiceId } from '../Constant/CliInteractionServiceId.js';
import { CliInteractionConfig } from '../Data/CliInteractionConfig.js';
import { OutputFactory } from '../Output/Factory/OutputFactory.js';

import { CliInteractionConfigContract } from '../Data/Contract/CliInteractionConfigContract.js';
import type { ConfigContract } from '../../../Application/Data/Contract/ConfigContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.js';

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

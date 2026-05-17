import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.js';
import { CliInteractionServiceId } from '../Constant/CliInteractionServiceId.js';
import { CliInteractionConfig } from '../Data/CliInteractionConfig.js';
import { OutputFactory } from '../Output/Factory/OutputFactory.js';

import type { CliInteractionConfigContract } from '../Data/Contract/CliInteractionConfigContract.js';
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

    static publishConfig(container: ContainerContract): void {
        const config = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);

        if ((config as unknown as CliInteractionConfigContract).isInteractive !== undefined) {
            container.setSingleton(CliInteractionServiceId.CliInteractionConfigContract, config);
            return;
        }

        container.setSingleton(CliInteractionServiceId.CliInteractionConfigContract, new CliInteractionConfig());
    }

    static publishOutputFactory(container: ContainerContract): void {
        const config = container.getSingleton<CliInteractionConfigContract>(
            CliInteractionServiceId.CliInteractionConfigContract,
        );

        container.setSingleton(CliInteractionServiceId.OutputFactoryContract, new OutputFactory(config));
    }
}

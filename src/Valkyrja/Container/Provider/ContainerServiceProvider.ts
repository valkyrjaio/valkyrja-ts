import { ApplicationServiceId } from '../../Application/Constant/ApplicationContainerServiceId.js';
import { ContainerServiceId } from '../Constant/ContainerContainerServiceId.js';

import type { ApplicationContract } from '../../Application/Kernel/Contract/ApplicationContract.js';
import type { ContainerContract } from '../Manager/Contract/ContainerContract.js';
import type { ServiceProviderConstructor } from './Contract/ServiceProviderContract.js';

export class ContainerServiceProvider implements InstanceType<ServiceProviderConstructor> {
    static publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ContainerServiceId.Data]: ContainerServiceProvider.publishData,
        };
    }

    static publishData(container: ContainerContract): void {
        const app = container.getSingleton<ApplicationContract>(ApplicationContainerServiceId.ApplicationContract);

        for (const provider of app.getContainerProviders()) {
            container.register(provider);
        }

        container.setSingleton(ContainerServiceId.Data, container.getData());
    }
}
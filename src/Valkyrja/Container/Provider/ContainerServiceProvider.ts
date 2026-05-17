import { ApplicationServiceId } from '../../Application/Constant/ApplicationServiceId.js';
import { ContainerServiceId } from '../Constant/ContainerServiceId.js';

import type { ApplicationContract } from '../../Application/Kernel/Contract/ApplicationContract.js';
import type { ContainerContract } from '../Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from './Contract/ServiceProviderContract.js';

export class ContainerServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ContainerServiceId.Data]: ContainerServiceProvider.publishData,
        };
    }

    static publishData(container: ContainerContract): void {
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        for (const provider of app.getContainerProviders()) {
            container.register(provider);
        }

        container.setSingleton(ContainerServiceId.Data, container.getData());
    }
}

import { ServiceId as ApplicationServiceId } from '../../Application/Constant/ServiceId.js';
import { ServiceId } from '../Constant/ServiceId.js';

import type { ApplicationContract } from '../../Application/Kernel/Contract/ApplicationContract.js';
import type { ContainerContract } from '../Manager/Contract/ContainerContract.js';
import type { ServiceProviderConstructor } from './Contract/ServiceProviderContract.js';

export class ContainerServiceProvider implements InstanceType<ServiceProviderConstructor> {
    static publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ServiceId.Data]: ContainerServiceProvider.publishData,
        };
    }

    static publishData(container: ContainerContract): void {
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        for (const provider of app.getContainerProviders()) {
            container.register(provider);
        }

        container.setSingleton(ServiceId.Data, container.getData());
    }
}
import { ContainerComponentProvider } from '../../Container/Provider/ContainerComponentProvider.js';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderConstructor } from './Contract/ComponentProviderContract.js';
import type { ServiceProviderConstructor } from '../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ListenerProviderConstructor } from '../../Event/Provider/Contract/ListenerProviderContract.js';
import type { CliRouteProviderConstructor } from '../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { HttpRouteProviderConstructor } from '../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';

export class ApplicationComponentProvider implements InstanceType<ComponentProviderConstructor> {
    static getComponentProviders(_app: ApplicationContract): ComponentProviderConstructor[] {
        return [
            ContainerComponentProvider,
        ];
    }

    static getContainerProviders(_app: ApplicationContract): ServiceProviderConstructor[] {
        return [];
    }

    static getEventProviders(_app: ApplicationContract): ListenerProviderConstructor[] {
        return [];
    }

    static getCliProviders(_app: ApplicationContract): CliRouteProviderConstructor[] {
        return [];
    }

    static getHttpProviders(_app: ApplicationContract): HttpRouteProviderConstructor[] {
        return [];
    }
}
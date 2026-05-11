import { ContainerServiceProvider } from './ContainerServiceProvider.js';

import type { ApplicationContract } from '../../Application/Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderConstructor } from '../../Application/Provider/Contract/ComponentProviderContract.js';
import type { ServiceProviderConstructor } from './Contract/ServiceProviderContract.js';
import type { ListenerProviderConstructor } from '../../Event/Provider/Contract/ListenerProviderContract.js';
import type { CliRouteProviderConstructor } from '../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { HttpRouteProviderConstructor } from '../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';

export class ContainerComponentProvider implements InstanceType<ComponentProviderConstructor> {
    static getComponentProviders(_app: ApplicationContract): ComponentProviderConstructor[] {
        return [];
    }

    static getContainerProviders(_app: ApplicationContract): ServiceProviderConstructor[] {
        return [ContainerServiceProvider];
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

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderConstructor, ComponentProviderContract } from '../../../Application/Provider/Contract/ComponentProviderContract.js';
import type { ServiceProviderConstructor } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ListenerProviderConstructor } from '../../../Event/Provider/Contract/ListenerProviderContract.js';
import type { HttpRouteProviderConstructor } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';
import type { CliRouteProviderConstructor } from './Contract/CliRouteProviderContract.js';
import { CliRoutingCliRouteProvider } from './CliRoutingCliRouteProvider.js';
import { CliRoutingServiceProvider } from './CliRoutingServiceProvider.js';

export class CliRoutingComponentProvider implements ComponentProviderContract {
    static getComponentProviders(_app: ApplicationContract): ComponentProviderConstructor[] {
        return [];
    }

    static getContainerProviders(_app: ApplicationContract): ServiceProviderConstructor[] {
        return [
            CliRoutingServiceProvider,
        ];
    }

    static getEventProviders(_app: ApplicationContract): ListenerProviderConstructor[] {
        return [];
    }

    static getCliProviders(_app: ApplicationContract): CliRouteProviderConstructor[] {
        return [
            CliRoutingCliRouteProvider,
        ];
    }

    static getHttpProviders(_app: ApplicationContract): HttpRouteProviderConstructor[] {
        return [];
    }
}

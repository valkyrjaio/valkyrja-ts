import { CliRoutingCliRouteProvider } from './CliRoutingCliRouteProvider.js';
import { CliRoutingServiceProvider } from './CliRoutingServiceProvider.js';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderContract } from '../../../Application/Provider/Contract/ComponentProviderContract.js';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ListenerProviderContract } from '../../../Event/Provider/Contract/ListenerProviderContract.js';
import type { HttpRouteProviderContract } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';
import type { CliRouteProviderContract } from './Contract/CliRouteProviderContract.js';

export class CliRoutingComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new CliRoutingServiceProvider()];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [new CliRoutingCliRouteProvider()];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [];
    }
}

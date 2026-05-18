import { HttpRoutingCliRouteProvider } from './HttpRoutingCliRouteProvider.js';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderContract } from '../../../Application/Provider/Contract/ComponentProviderContract.js';
import type { CliRouteProviderContract } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { HttpRouteProviderContract } from './Contract/HttpRouteProviderContract.js';
import type { ListenerProviderContract } from '../../../Event/Provider/Contract/ListenerProviderContract.js';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.js';

export class HttpRoutingCliComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [new HttpRoutingCliRouteProvider()];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [];
    }
}

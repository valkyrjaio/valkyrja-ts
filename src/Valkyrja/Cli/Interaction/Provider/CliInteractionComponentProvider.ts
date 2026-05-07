import { CliInteractionServiceProvider } from './CliInteractionServiceProvider.js';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderConstructor } from '../../../Application/Provider/Contract/ComponentProviderContract.js';
import type { ServiceProviderConstructor } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import type { CliRouteProviderConstructor } from '../../Routing/Provider/Contract/CliRouteProviderContract.js';
import type { ListenerProviderConstructor } from '../../../Event/Provider/Contract/ListenerProviderContract.js';
import type { HttpRouteProviderConstructor } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';

export class CliInteractionComponentProvider {
    static getComponentProviders(_app: ApplicationContract): ComponentProviderConstructor[] {
        return [];
    }

    static getContainerProviders(_app: ApplicationContract): ServiceProviderConstructor[] {
        return [CliInteractionServiceProvider];
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
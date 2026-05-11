import type { CliRouteProviderConstructor } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { ListenerProviderConstructor } from '../../../Event/Provider/Contract/ListenerProviderContract.js';
import type { HttpRouteProviderConstructor } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';
import type { ServiceProviderConstructor } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.js';

export interface ComponentProviderContract {}

export interface ComponentProviderConstructor {
    new(): ComponentProviderContract;
    getComponentProviders(app: ApplicationContract): ComponentProviderConstructor[];
    getContainerProviders(app: ApplicationContract): ServiceProviderConstructor[];
    getEventProviders(app: ApplicationContract): ListenerProviderConstructor[];
    getCliProviders(app: ApplicationContract): CliRouteProviderConstructor[];
    getHttpProviders(app: ApplicationContract): HttpRouteProviderConstructor[];
}

import type { CliRouteProviderConstructor } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { ListenerProviderConstructor } from '../../../Event/Provider/Contract/ListenerProviderContract.js';
import type { HttpRouteProviderConstructor } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderConstructor } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ComponentProviderConstructor } from '../../Provider/Contract/ComponentProviderContract.js';

export interface ApplicationContract {
    getContainer(): ContainerContract;
    publishProviderCallbacks(): void;
    getProviders(): ComponentProviderConstructor[];
    getContainerProviders(): ServiceProviderConstructor[];
    getEventProviders(): ListenerProviderConstructor[];
    getCliProviders(): CliRouteProviderConstructor[];
    getHttpProviders(): HttpRouteProviderConstructor[];
    getDebugMode(): boolean;
    getEnvironment(): string;
    getVersion(): string;
}
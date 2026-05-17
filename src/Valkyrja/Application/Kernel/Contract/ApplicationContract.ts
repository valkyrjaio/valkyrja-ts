import type { CliRouteProviderContract } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { ListenerProviderContract } from '../../../Event/Provider/Contract/ListenerProviderContract.js';
import type { HttpRouteProviderContract } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ComponentProviderContract } from '../../Provider/Contract/ComponentProviderContract.js';

export interface ApplicationContract {
    getContainer(): ContainerContract;
    publishProviderCallbacks(): void;
    getProviders(): ComponentProviderContract[];
    getContainerProviders(): ServiceProviderContract[];
    getEventProviders(): ListenerProviderContract[];
    getCliProviders(): CliRouteProviderContract[];
    getHttpProviders(): HttpRouteProviderContract[];
    getDebugMode(): boolean;
    getEnvironment(): string;
    getVersion(): string;
}

export namespace ApplicationContract {
    export function instanceOf(value: unknown): value is ApplicationContract {
        return typeof value === 'object' && value !== null && 'getContainer' in value;
    }
}

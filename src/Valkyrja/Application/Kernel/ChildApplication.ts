import type { ApplicationContract } from './Contract/ApplicationContract.js';
import type { ComponentProviderConstructor } from '../Provider/Contract/ComponentProviderContract.js';
import type { ContainerContract } from '../../Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderConstructor } from '../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ListenerProviderConstructor } from '../../Event/Provider/Contract/ListenerProviderContract.js';
import type { CliRouteProviderConstructor } from '../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { HttpRouteProviderConstructor } from '../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';

export class ChildApplication implements ApplicationContract {
    constructor(
        protected readonly parent: ApplicationContract,
        protected readonly container: ContainerContract,
    ) {}

    getContainer(): ContainerContract {
        return this.container;
    }

    publishProviderCallbacks(): void {
        this.parent.publishProviderCallbacks();
    }

    getProviders(): ComponentProviderConstructor[] {
        return this.parent.getProviders();
    }

    getContainerProviders(): ServiceProviderConstructor[] {
        return this.parent.getContainerProviders();
    }

    getEventProviders(): ListenerProviderConstructor[] {
        return this.parent.getEventProviders();
    }

    getCliProviders(): CliRouteProviderConstructor[] {
        return this.parent.getCliProviders();
    }

    getHttpProviders(): HttpRouteProviderConstructor[] {
        return this.parent.getHttpProviders();
    }

    getDebugMode(): boolean {
        return this.parent.getDebugMode();
    }

    getEnvironment(): string {
        return this.parent.getEnvironment();
    }

    getVersion(): string {
        return this.parent.getVersion();
    }
}
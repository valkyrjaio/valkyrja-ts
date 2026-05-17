import type { ApplicationContract } from './Contract/ApplicationContract.js';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.js';
import type { ContainerContract } from '../../Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from '../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ListenerProviderContract } from '../../Event/Provider/Contract/ListenerProviderContract.js';
import type { CliRouteProviderContract } from '../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { HttpRouteProviderContract } from '../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';

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

    getProviders(): ComponentProviderContract[] {
        return this.parent.getProviders();
    }

    getContainerProviders(): ServiceProviderContract[] {
        return this.parent.getContainerProviders();
    }

    getEventProviders(): ListenerProviderContract[] {
        return this.parent.getEventProviders();
    }

    getCliProviders(): CliRouteProviderContract[] {
        return this.parent.getCliProviders();
    }

    getHttpProviders(): HttpRouteProviderContract[] {
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

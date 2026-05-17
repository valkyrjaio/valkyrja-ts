import { Config } from '../Data/Config.js';

import type { ApplicationContract } from './Contract/ApplicationContract.js';
import type { ConfigContract } from '../Data/Contract/ConfigContract.js';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.js';
import type { ContainerContract } from '../../Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from '../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ListenerProviderContract } from '../../Event/Provider/Contract/ListenerProviderContract.js';
import type { CliRouteProviderContract } from '../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { HttpRouteProviderContract } from '../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';

export class Valkyrja implements ApplicationContract {
    protected providers: ComponentProviderContract[] = [];
    protected serviceProviders: ServiceProviderContract[] = [];
    protected eventProviders: ListenerProviderContract[] = [];
    protected cliRouteProviders: CliRouteProviderContract[] = [];
    protected httpRouteProviders: HttpRouteProviderContract[] = [];

    constructor(
        protected readonly container: ContainerContract,
        protected readonly config: ConfigContract = new Config(),
    ) {
        this.bootstrapTimezone();
    }

    getContainer(): ContainerContract {
        return this.container;
    }

    publishProviderCallbacks(): void {
        for (const callback of this.config.callbacks) {
            callback(this);
        }
    }

    getProviders(): ComponentProviderContract[] {
        if (this.providers.length > 0) {
            return this.providers;
        }

        const providers: ComponentProviderContract[][] = [];

        for (const provider of this.config.providers) {
            providers.push(provider.getComponentProviders(this));
            providers.push([provider]);
        }

        this.providers = [...new Set(providers.flat())];

        return this.providers;
    }

    getContainerProviders(): ServiceProviderContract[] {
        if (this.serviceProviders.length > 0) {
            return this.serviceProviders;
        }

        const providers: ServiceProviderContract[][] = [];

        for (const provider of this.getProviders()) {
            providers.push(provider.getContainerProviders(this));
        }

        this.serviceProviders = [...new Set(providers.flat())];

        return this.serviceProviders;
    }

    getEventProviders(): ListenerProviderContract[] {
        if (this.eventProviders.length > 0) {
            return this.eventProviders;
        }

        const providers: ListenerProviderContract[][] = [];

        for (const provider of this.getProviders()) {
            providers.push(provider.getEventProviders(this));
        }

        this.eventProviders = [...new Set(providers.flat())];

        return this.eventProviders;
    }

    getCliProviders(): CliRouteProviderContract[] {
        if (this.cliRouteProviders.length > 0) {
            return this.cliRouteProviders;
        }

        const providers: CliRouteProviderContract[][] = [];

        for (const provider of this.getProviders()) {
            providers.push(provider.getCliProviders(this));
        }

        this.cliRouteProviders = [...new Set(providers.flat())];

        return this.cliRouteProviders;
    }

    getHttpProviders(): HttpRouteProviderContract[] {
        if (this.httpRouteProviders.length > 0) {
            return this.httpRouteProviders;
        }

        const providers: HttpRouteProviderContract[][] = [];

        for (const provider of this.getProviders()) {
            providers.push(provider.getHttpProviders(this));
        }

        this.httpRouteProviders = [...new Set(providers.flat())];

        return this.httpRouteProviders;
    }

    getDebugMode(): boolean {
        return this.config.debugMode;
    }

    getEnvironment(): string {
        return this.config.environment;
    }

    getVersion(): string {
        return this.config.version;
    }

    protected bootstrapTimezone(): void {
        process.env['TZ'] = this.config.timezone;
    }
}

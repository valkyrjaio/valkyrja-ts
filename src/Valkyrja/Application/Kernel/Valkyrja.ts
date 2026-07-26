/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config } from '../Data/Config.ts';

import type { ApplicationContract } from './Contract/ApplicationContract.ts';
import type { ConfigContract } from '../Data/Contract/ConfigContract.ts';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.ts';
import type { ContainerContract } from '../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { ListenerProviderContract } from '../../Event/Provider/Contract/ListenerProviderContract.ts';
import type { CliRouteProviderContract } from '../../Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { HttpRouteProviderContract } from '../../Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

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

        for (const provider of this.config.providers) {
            this.collectProviders(provider);
        }

        return this.providers;
    }

    protected collectProviders(provider: ComponentProviderContract): void {
        for (const subProvider of provider.getComponentProviders(this)) {
            this.collectProviders(subProvider);
        }

        this.providers.push(provider);
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

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ApplicationContract } from './Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.ts';
import type { ContainerContract } from '../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { ListenerProviderContract } from '../../Event/Provider/Contract/ListenerProviderContract.ts';
import type { CliRouteProviderContract } from '../../Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { HttpRouteProviderContract } from '../../Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

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

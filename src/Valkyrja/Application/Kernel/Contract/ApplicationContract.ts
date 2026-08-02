/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { CliRouteProviderContract } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { ListenerProviderContract } from '../../../Event/Provider/Contract/ListenerProviderContract.ts';
import type { HttpRouteProviderContract } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { ComponentProviderContract } from '../../Provider/Contract/ComponentProviderContract.ts';

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

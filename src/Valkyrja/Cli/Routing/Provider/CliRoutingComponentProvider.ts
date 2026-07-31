/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider } from '../../../Application/Provider/Abstract/ComponentProvider.ts';
import { CliRoutingCliRouteProvider } from './CliRoutingCliRouteProvider.ts';
import { CliRoutingServiceProvider } from './CliRoutingServiceProvider.ts';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { CliRouteProviderContract } from './Contract/CliRouteProviderContract.ts';

export class CliRoutingComponentProvider extends ComponentProvider {
    override getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new CliRoutingServiceProvider()];
    }

    override getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [new CliRoutingCliRouteProvider()];
    }
}

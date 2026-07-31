/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider } from '../../../Application/Provider/Abstract/ComponentProvider.ts';
import { HttpRoutingCliRouteProvider } from './HttpRoutingCliRouteProvider.ts';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.ts';
import type { CliRouteProviderContract } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';

export class HttpRoutingCliComponentProvider extends ComponentProvider {
    override getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [new HttpRoutingCliRouteProvider()];
    }
}

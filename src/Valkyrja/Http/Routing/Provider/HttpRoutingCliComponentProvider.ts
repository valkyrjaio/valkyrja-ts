/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { HttpRoutingCliRouteProvider } from './HttpRoutingCliRouteProvider.ts';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../../../Application/Provider/Contract/ComponentProviderContract.ts';
import type { CliRouteProviderContract } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { HttpRouteProviderContract } from './Contract/HttpRouteProviderContract.ts';
import type { ListenerProviderContract } from '../../../Event/Provider/Contract/ListenerProviderContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';

export class HttpRoutingCliComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [new HttpRoutingCliRouteProvider()];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [];
    }
}

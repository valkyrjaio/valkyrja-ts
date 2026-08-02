/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CliMiddlewareServiceProvider } from './CliMiddlewareServiceProvider.ts';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../../../Application/Provider/Contract/ComponentProviderContract.ts';
import type { CliRouteProviderContract } from '../../Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { ListenerProviderContract } from '../../../Event/Provider/Contract/ListenerProviderContract.ts';
import type { HttpRouteProviderContract } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

export class CliMiddlewareComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new CliMiddlewareServiceProvider()];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [];
    }
}

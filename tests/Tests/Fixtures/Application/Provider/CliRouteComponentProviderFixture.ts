/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CliRouteProviderFixture } from './CliRouteProviderFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { CliRouteProviderContract } from '../../../../../src/Valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { ComponentProviderContract } from '../../../../../src/Valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';
import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { ListenerProviderContract } from '../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { HttpRouteProviderContract } from '../../../../../src/Valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import type { GrpcRouteProviderContract } from '../../../../../src/Valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';

export class CliRouteComponentProviderFixture implements ComponentProviderContract {
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
        return [new CliRouteProviderFixture()];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [];
    }

    getGrpcProviders(_app: ApplicationContract): GrpcRouteProviderContract[] {
        return [];
    }
}

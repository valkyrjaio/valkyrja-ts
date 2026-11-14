/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ContainerComponentProvider } from '../../Container/Provider/ContainerComponentProvider.ts';
import { GrpcMiddlewareComponentProvider } from '../../Grpc/Middleware/Provider/GrpcMiddlewareComponentProvider.ts';
import { GrpcRoutingComponentProvider } from '../../Grpc/Routing/Provider/GrpcRoutingComponentProvider.ts';
import { GrpcServerComponentProvider } from '../../Grpc/Server/Provider/GrpcServerComponentProvider.ts';
import { ApplicationComponentProvider } from './ApplicationComponentProvider.ts';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from './Contract/ComponentProviderContract.ts';

export class GrpcApplicationComponentProvider extends ApplicationComponentProvider {
    override getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [
            new ContainerComponentProvider(),
            new GrpcMiddlewareComponentProvider(),
            new GrpcRoutingComponentProvider(),
            new GrpcServerComponentProvider(),
        ];
    }
}

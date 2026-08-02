/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/Abstract/ComponentProvider.ts';
import { GrpcRouteProviderFixture } from './GrpcRouteProviderFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { GrpcRouteProviderContract } from '../../../../../src/Valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';

export class GrpcRouteComponentProviderFixture extends ComponentProvider {
    override getGrpcProviders(_app: ApplicationContract): GrpcRouteProviderContract[] {
        return [new GrpcRouteProviderFixture()];
    }
}

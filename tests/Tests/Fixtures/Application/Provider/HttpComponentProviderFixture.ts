/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/Abstract/ComponentProvider.ts';
import { HttpContainerDataProviderFixture } from './HttpContainerDataProviderFixture.ts';
import { HttpRoutingDataProviderFixture } from './HttpRoutingDataProviderFixture.ts';
import { HttpRouteProviderFixture } from './HttpRouteProviderFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { HttpRouteProviderContract } from '../../../../../src/Valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

export class HttpComponentProviderFixture extends ComponentProvider {
    override getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new HttpContainerDataProviderFixture(), new HttpRoutingDataProviderFixture()];
    }

    override getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [new HttpRouteProviderFixture()];
    }
}

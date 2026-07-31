/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/Abstract/ComponentProvider.ts';
import { CliContainerDataProviderFixture } from './CliContainerDataProviderFixture.ts';
import { CliRoutingDataProviderFixture } from './CliRoutingDataProviderFixture.ts';
import { CliRouteProviderFixture } from './CliRouteProviderFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { CliRouteProviderContract } from '../../../../../src/Valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';

export class CliComponentProviderFixture extends ComponentProvider {
    override getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new CliContainerDataProviderFixture(), new CliRoutingDataProviderFixture()];
    }

    override getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [new CliRouteProviderFixture()];
    }
}

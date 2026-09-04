/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ContainerContract } from '../../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';

import { SingletonFixture } from '../SingletonFixture.ts';

/**
 * A provider that publishes one instance, and no singleton binding. The container it publishes
 * into holds the instance, so the id reads as a singleton instance and never as a binding.
 */
export class PublishingProviderFixture implements ServiceProviderContract {
    static readonly PROVIDED_ID = 'PublishedClass';

    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [PublishingProviderFixture.PROVIDED_ID]: (container: ContainerContract): void => {
                container.setSingleton(PublishingProviderFixture.PROVIDED_ID, new SingletonFixture());
            },
        };
    }
}

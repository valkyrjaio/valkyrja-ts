/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { ContainerContract } from '../../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';

export class ProviderFixture implements ServiceProviderContract {
    static readonly PROVIDED_ID = 'ProvidedClass';
    static readonly PROVIDED_SECONDARY_ID = 'ProvidedSecondaryClass';
    static publishCalled = false;
    static publishSecondaryCalled = false;

    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ProviderFixture.PROVIDED_ID]: (): void => {
                ProviderFixture.publishCalled = true;
            },
            [ProviderFixture.PROVIDED_SECONDARY_ID]: (): void => {
                ProviderFixture.publishSecondaryCalled = true;
            },
        };
    }
}

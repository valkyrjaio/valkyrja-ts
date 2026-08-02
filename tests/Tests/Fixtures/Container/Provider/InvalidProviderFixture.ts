/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { ContainerContract } from '../../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';

export class InvalidProviderFixture implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        // Intentionally returns a non-callable to exercise the invalid-publish-callback guard.
        return { InvalidId: 'not-a-callable' as unknown as (container: ContainerContract) => void };
    }
}

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceProviderContract } from '../../Provider/Contract/ServiceProviderContract.ts';

export interface ProvidersAwareContract {
    register(provider: ServiceProviderContract): void;
    isDeferred(id: string): boolean;
    isPublished(id: string): boolean;
    publish(id: string): void;
}

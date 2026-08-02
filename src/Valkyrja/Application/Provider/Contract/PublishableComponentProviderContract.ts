/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.ts';

export interface PublishableComponentProviderContract {
    publish(app: ApplicationContract): void;
}

export namespace PublishableComponentProviderContract {
    export function instanceOf(value: unknown): value is PublishableComponentProviderContract {
        return typeof value === 'object' && value !== null && 'publish' in value;
    }
}

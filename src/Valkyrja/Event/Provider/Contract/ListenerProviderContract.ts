/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ListenerContract } from '../../Data/Contract/ListenerContract.ts';

export interface ListenerProviderContract {
    getListeners(): ListenerContract[];
}

export namespace ListenerProviderContract {
    export function instanceOf(value: unknown): value is ListenerProviderContract {
        return typeof value === 'object' && value !== null && 'getListeners' in value;
    }
}

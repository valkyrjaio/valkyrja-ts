/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { EventContract } from './EventContract.ts';

export interface DispatchCollectableEventContract extends EventContract {
    /**
     * Add a dispatch.
     *
     * @param dispatch The value that one listener returned
     */
    addDispatch(dispatch: unknown): void;

    /**
     * Get what each listener returned, in the order that the dispatcher ran them.
     */
    getDispatches(): unknown[];
}

export namespace DispatchCollectableEventContract {
    export function instanceOf(value: unknown): value is DispatchCollectableEventContract {
        return EventContract.instanceOf(value) && 'addDispatch' in value;
    }
}

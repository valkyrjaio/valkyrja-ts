/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { EventContract } from './EventContract.ts';

export interface StoppableEventContract extends EventContract {
    /**
     * Determine if the dispatcher stops before it runs the next listener.
     */
    isPropagationStopped(): boolean;
}

export namespace StoppableEventContract {
    export function instanceOf(value: unknown): value is StoppableEventContract {
        return EventContract.instanceOf(value) && 'isPropagationStopped' in value;
    }
}

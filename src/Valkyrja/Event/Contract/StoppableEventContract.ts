/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { EventContract } from './EventContract.ts';

/**
 * An event that stops the listeners after it.
 *
 * The PHP port takes this contract from PSR-14. TypeScript has no PSR, so the
 * framework declares it. The Java port made the same decision.
 */
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

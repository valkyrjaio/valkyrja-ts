/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { EventContract } from './EventContract.ts';

/**
 * An event that the dispatcher fills with the arguments that the caller gave.
 */
export interface ArgumentsCapableEventContract extends EventContract {
    /**
     * Set the arguments.
     *
     * @param args The arguments
     */
    setArguments(args: unknown[]): ArgumentsCapableEventContract;
}

export namespace ArgumentsCapableEventContract {
    export function instanceOf(value: unknown): value is ArgumentsCapableEventContract {
        return EventContract.instanceOf(value) && 'setArguments' in value;
    }
}

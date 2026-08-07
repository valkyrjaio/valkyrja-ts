/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface EventContract {
    /**
     * Get the identifier of the event.
     */
    getEventId(): string;
}

export namespace EventContract {
    export function instanceOf(value: unknown): value is EventContract {
        return typeof value === 'object' && value !== null && 'getEventId' in value;
    }
}

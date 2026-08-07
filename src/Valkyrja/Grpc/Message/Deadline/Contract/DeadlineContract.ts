/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface DeadlineContract {
    /**
     * Get the absolute time at which the budget expires, as epoch milliseconds;
     * `Number.POSITIVE_INFINITY` when no deadline is set.
     */
    getAbsoluteTime(): number;

    /**
     * Get the remaining budget from now, in milliseconds; `0` if already expired, and a very large
     * duration when no deadline is set.
     */
    getRemaining(): number;

    /** Whether the deadline has elapsed. Always false when no deadline is set. */
    isExpired(): boolean;

    /** Whether a deadline is set at all. */
    hasDeadline(): boolean;
}

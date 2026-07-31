/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The absolute time at which a call's budget expires.
 *
 * Computed once at call receipt from the inbound `grpc-timeout` header and propagated as an
 * absolute time so every downstream layer agrees on the same reference point. Never null on a
 * service call; `Deadline.none()` is the sentinel for "no deadline set by the client."
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

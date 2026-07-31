/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { DeadlineContract } from './Contract/DeadlineContract.ts';

/** A source of the current time, in epoch milliseconds. */
export type Clock = () => number;

/**
 * Immutable {@link DeadlineContract} implementation.
 *
 * Holds an absolute expiry time in epoch milliseconds and consults a {@link Clock} for
 * {@link Deadline.getRemaining} and {@link Deadline.isExpired}. The system-clock factories
 * ({@link Deadline.fromTimeout}, {@link Deadline.fromAbsolute}, {@link Deadline.none}) cover normal
 * use; the clock argument exists for deterministic testing.
 */
export class Deadline implements DeadlineContract {
    /**
     * The sentinel "remaining budget" reported when no deadline is set. A large but finite duration
     * (100 years, in milliseconds) so it reads as effectively infinite without overflowing in
     * downstream arithmetic — a consistent choice every language port can reproduce.
     */
    static readonly INFINITE_REMAINING = 365 * 100 * 24 * 60 * 60 * 1000;

    protected readonly absoluteTime: number;
    protected readonly hasDeadlineSet: boolean;
    protected readonly clock: Clock;

    protected constructor(absoluteTime: number, hasDeadlineSet: boolean, clock: Clock) {
        this.absoluteTime = absoluteTime;
        this.hasDeadlineSet = hasDeadlineSet;
        this.clock = clock;
    }

    getAbsoluteTime(): number {
        return this.absoluteTime;
    }

    getRemaining(): number {
        if (!this.hasDeadlineSet) {
            return Deadline.INFINITE_REMAINING;
        }

        const remaining = this.absoluteTime - this.clock();

        return remaining < 0 ? 0 : remaining;
    }

    isExpired(): boolean {
        return this.hasDeadlineSet && this.clock() >= this.absoluteTime;
    }

    hasDeadline(): boolean {
        return this.hasDeadlineSet;
    }

    // --- Factories -------------------------------------------------------------------------------

    static fromTimeout(timeout: number, clock: Clock = Date.now): Deadline {
        return new Deadline(clock() + timeout, true, clock);
    }

    static fromAbsolute(absoluteTime: number, clock: Clock = Date.now): Deadline {
        return new Deadline(absoluteTime, true, clock);
    }

    static none(clock: Clock = Date.now): Deadline {
        return new Deadline(Number.POSITIVE_INFINITY, false, clock);
    }
}

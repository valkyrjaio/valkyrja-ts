/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CancelledException } from '../../Throwable/Exception/CancelledException.ts';

import type { CancellationReason } from '../Enum/CancellationReason.ts';
import type { CancellationTokenContract } from './Contract/CancellationTokenContract.ts';

/**
 * Mutable {@link CancellationTokenContract} implementation.
 *
 * Adapters wire the token: they listen to the library's native cancellation signal and to the
 * deadline timer, calling {@link CancellationToken.cancel} when either fires. Framework and user
 * code only ever read the token (poll or listener). {@link CancellationToken.never} is the sentinel
 * used when a call has no cancellation source.
 */
export class CancellationToken implements CancellationTokenContract {
    protected cancelled = false;
    protected reason: CancellationReason | null = null;
    protected readonly listeners: (() => void)[] = [];

    isCancelled(): boolean {
        return this.cancelled;
    }

    getReason(): CancellationReason | null {
        return this.reason;
    }

    throwIfCancelled(): void {
        if (this.cancelled) {
            throw new CancelledException('The call has been cancelled', this.reason);
        }
    }

    onCancelled(listener: () => void): void {
        if (this.cancelled) {
            listener();

            return;
        }

        this.listeners.push(listener);
    }

    /**
     * Fire cancellation with the given reason. Idempotent: subsequent calls are ignored so the first
     * cause wins and listeners run at most once.
     */
    cancel(reason: CancellationReason): void {
        if (this.cancelled) {
            return;
        }

        this.reason = reason;
        this.cancelled = true;

        const toFire = [...this.listeners];

        this.listeners.length = 0;

        for (const listener of toFire) {
            listener();
        }
    }

    /** A token that never fires — the sentinel for a call with no cancellation source. */
    static never(): CancellationToken {
        return new CancellationToken();
    }
}

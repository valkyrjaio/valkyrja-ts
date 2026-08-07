/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CancelledException } from '../../Throwable/Exception/CancelledException.ts';

import type { CancellationReason } from '../Enum/CancellationReason.ts';
import type { CancellationTokenContract } from './Contract/CancellationTokenContract.ts';

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

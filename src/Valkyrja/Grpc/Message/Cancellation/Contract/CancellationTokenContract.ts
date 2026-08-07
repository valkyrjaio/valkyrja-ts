/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { CancellationReason } from '../../Enum/CancellationReason.ts';

export interface CancellationTokenContract {
    /** Whether cancellation has fired. */
    isCancelled(): boolean;

    /** Get the cause of cancellation, or null if not cancelled. */
    getReason(): CancellationReason | null;

    /** Throw a `CancelledException` if the call is cancelled; otherwise do nothing. */
    throwIfCancelled(): void;

    /**
     * Register a listener fired when cancellation occurs. If already cancelled, the listener runs
     * immediately.
     */
    onCancelled(listener: () => void): void;
}

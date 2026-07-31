/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CancellationReason } from '../../Enum/CancellationReason.ts';

/**
 * The signal for "should this work stop?"
 *
 * Unifies two causes: client-initiated cancellation (HTTP/2 RST_STREAM) and deadline expiry.
 * Deadline expiry is modeled as a cause of cancellation; code only checks cancellation, consulting
 * {@link CancellationTokenContract.getReason} if the distinction matters. The base contract is poll
 * + listener, which works in every language.
 */
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

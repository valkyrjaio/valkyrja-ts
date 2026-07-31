/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GrpcRuntimeException } from './Abstract/GrpcRuntimeException.ts';

import type { CancellationReason } from '../../Message/Enum/CancellationReason.ts';

/**
 * Thrown when work is performed on a cancelled call.
 *
 * Raised by `CancellationToken.throwIfCancelled()` when a handler opts to fail loudly on
 * cancellation. It carries the `CancellationReason` so `ThrowableCaught` middleware can map it to
 * either `CANCELLED` or `DEADLINE_EXCEEDED`. Language-native cancellation errors are converted to
 * this type at the adapter boundary.
 */
export class CancelledException extends GrpcRuntimeException {
    protected readonly reason: CancellationReason | null;

    constructor(message: string, reason: CancellationReason | null = null) {
        super(message);

        this.reason = reason;
    }

    /** Get the cause of the cancellation, or null if unspecified. */
    getReason(): CancellationReason | null {
        return this.reason;
    }
}

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

/**
 * The cause behind a cancelled call.
 *
 * Cancellation unifies two causes: client-initiated cancellation (HTTP/2 RST_STREAM) and deadline
 * expiry. Code only checks cancellation; it consults the reason when the distinction matters.
 */
export enum CancellationReason {
    CLIENT_CANCELLED = 'CLIENT_CANCELLED',
    DEADLINE_EXCEEDED = 'DEADLINE_EXCEEDED',
}

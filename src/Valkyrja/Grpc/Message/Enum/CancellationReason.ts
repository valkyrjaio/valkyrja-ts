/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

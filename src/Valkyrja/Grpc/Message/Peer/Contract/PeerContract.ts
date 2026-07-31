/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AddressType } from '../../Enum/AddressType.ts';
import type { AuthContextContract } from './AuthContextContract.ts';

/**
 * Information about the connection's other end, derived from the transport rather than a single
 * header. Never null on a service call; its auth context may be `insecure`.
 */
export interface PeerContract {
    /** Get the peer address, e.g. `192.168.1.5:54321` or `unix:/var/run/sock`. */
    getAddress(): string;

    /** Get the address family of the peer. */
    getAddressType(): AddressType;

    /** Get the peer's authentication context. Always present. */
    getAuthContext(): AuthContextContract;
}

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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

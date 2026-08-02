/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { AddressType } from '../Enum/AddressType.ts';
import { AuthContext } from './AuthContext.ts';

import type { AuthContextContract } from './Contract/AuthContextContract.ts';
import type { PeerContract } from './Contract/PeerContract.ts';

/** Immutable {@link PeerContract} implementation. */
export class Peer implements PeerContract {
    protected readonly address: string;
    protected readonly addressType: AddressType;
    protected readonly authContext: AuthContextContract;

    constructor(address: string, addressType: AddressType, authContext: AuthContextContract) {
        this.address = address;
        this.addressType = addressType;
        this.authContext = authContext;
    }

    getAddress(): string {
        return this.address;
    }

    getAddressType(): AddressType {
        return this.addressType;
    }

    getAuthContext(): AuthContextContract {
        return this.authContext;
    }

    /** A peer with an insecure auth context and unknown address type. */
    static insecure(address: string): Peer {
        return new Peer(address, AddressType.UNKNOWN, AuthContext.insecure());
    }
}

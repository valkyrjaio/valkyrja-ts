/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { AddressType } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/AddressType.ts';
import { AuthContext } from '../../../../../../src/Valkyrja/Grpc/Message/Peer/AuthContext.ts';
import { Peer } from '../../../../../../src/Valkyrja/Grpc/Message/Peer/Peer.ts';

describe('Peer', () => {
    it('exposes the address, family and auth context it was given', () => {
        const authContext = new AuthContext('tls');
        const peer = new Peer('192.168.1.5:54321', AddressType.IPV4, authContext);

        expect(peer.getAddress()).toBe('192.168.1.5:54321');
        expect(peer.getAddressType()).toBe(AddressType.IPV4);
        expect(peer.getAuthContext()).toBe(authContext);
    });

    it('builds an insecure peer with an unknown address family', () => {
        const peer = Peer.insecure('unknown');

        expect(peer.getAddress()).toBe('unknown');
        expect(peer.getAddressType()).toBe(AddressType.UNKNOWN);
        expect(peer.getAuthContext().getType()).toBe(AuthContext.TYPE_INSECURE);
    });
});

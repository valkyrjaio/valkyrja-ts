/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { AddressType } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/AddressType.ts';

describe('AddressType', () => {
    it('names every transport address family', () => {
        expect(AddressType.IPV4).toBe('IPV4');
        expect(AddressType.IPV6).toBe('IPV6');
        expect(AddressType.UNIX).toBe('UNIX');
        expect(AddressType.UNKNOWN).toBe('UNKNOWN');
    });
});

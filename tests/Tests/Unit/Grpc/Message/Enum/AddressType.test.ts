/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

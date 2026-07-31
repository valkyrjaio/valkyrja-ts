/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Certificate } from '../../../../../../src/Valkyrja/Grpc/Message/Peer/Certificate.ts';

describe('Certificate', () => {
    it('exposes its encoded bytes', () => {
        expect(new Certificate(new Uint8Array([1, 2, 3])).getEncoded()).toEqual(new Uint8Array([1, 2, 3]));
    });

    it('copies the bytes in and out so the caller cannot mutate them', () => {
        const encoded = new Uint8Array([1, 2, 3]);
        const certificate = new Certificate(encoded);

        encoded[0] = 9;
        certificate.getEncoded()[1] = 8;

        expect(certificate.getEncoded()).toEqual(new Uint8Array([1, 2, 3]));
    });
});

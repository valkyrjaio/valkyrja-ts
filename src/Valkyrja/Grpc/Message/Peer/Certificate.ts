/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CertificateContract } from './Contract/CertificateContract.ts';

/** Immutable {@link CertificateContract} implementation wrapping encoded (DER) bytes. */
export class Certificate implements CertificateContract {
    protected readonly encoded: Uint8Array;

    constructor(encoded: Uint8Array) {
        this.encoded = encoded.slice();
    }

    getEncoded(): Uint8Array {
        return this.encoded.slice();
    }
}

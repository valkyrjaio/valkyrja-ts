/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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

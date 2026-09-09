/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { AuthContextContract } from './Contract/AuthContextContract.ts';
import type { CertificateContract } from './Contract/CertificateContract.ts';

export class AuthContext implements AuthContextContract {
    static readonly TYPE_INSECURE = 'insecure';

    protected readonly type: string;
    protected readonly properties: Map<string, string[]>;
    protected readonly peerCertificates: CertificateContract[];
    protected readonly peerSubject: string | null;
    protected readonly transportSecurityType: string | null;

    constructor(
        type: string,
        properties: Map<string, string[]> = new Map(),
        peerCertificates: CertificateContract[] = [],
        peerSubject: string | null = null,
        transportSecurityType: string | null = null,
    ) {
        const propsCopy = new Map<string, string[]>();

        for (const [key, values] of properties) {
            propsCopy.set(key, [...values]);
        }

        this.type = type;
        this.properties = propsCopy;
        this.peerCertificates = [...peerCertificates];
        this.peerSubject = peerSubject;
        this.transportSecurityType = transportSecurityType;
    }

    getType(): string {
        return this.type;
    }

    getProperties(): Map<string, string[]> {
        const copy = new Map<string, string[]>();

        for (const [key, values] of this.properties) {
            copy.set(key, [...values]);
        }

        return copy;
    }

    getPeerCertificates(): CertificateContract[] {
        return [...this.peerCertificates];
    }

    getPeerSubject(): string | null {
        return this.peerSubject;
    }

    getTransportSecurityType(): string | null {
        return this.transportSecurityType;
    }

    /** An auth context for an insecure (plaintext) connection. */
    static insecure(): AuthContext {
        return new AuthContext(AuthContext.TYPE_INSECURE);
    }
}

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CertificateContract } from './CertificateContract.ts';

/**
 * The authentication context of a connection's peer. Always present; its type may be `insecure`.
 */
export interface AuthContextContract {
    /** Get the auth type: `ssl`, `tls`, `insecure`, or a custom value. */
    getType(): string;

    /** Get the auth properties as a multi-map of string keys to string values. */
    getProperties(): Map<string, string[]>;

    /** Get the peer certificate chain; empty if none were presented. */
    getPeerCertificates(): CertificateContract[];

    /** Get the peer subject (e.g. the certificate subject DN), or null if unknown. */
    getPeerSubject(): string | null;

    /** Get the transport security type (e.g. the negotiated cipher/protocol), or null if none. */
    getTransportSecurityType(): string | null;
}

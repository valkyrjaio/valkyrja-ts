/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AuthContext } from '../../../../../../src/Valkyrja/Grpc/Message/Peer/AuthContext.ts';
import { Certificate } from '../../../../../../src/Valkyrja/Grpc/Message/Peer/Certificate.ts';

describe('AuthContext', () => {
    it('defaults to an empty context for a bare type', () => {
        const authContext = new AuthContext('tls');

        expect(authContext.getType()).toBe('tls');
        expect(authContext.getProperties().size).toBe(0);
        expect(authContext.getPeerCertificates()).toEqual([]);
        expect(authContext.getPeerSubject()).toBeNull();
        expect(authContext.getTransportSecurityType()).toBeNull();
    });

    it('carries properties, certificates, subject and transport security type', () => {
        const certificate = new Certificate(new Uint8Array([1]));
        const authContext = new AuthContext(
            'ssl',
            new Map([['cipher', ['TLS_AES_128_GCM_SHA256']]]),
            [certificate],
            'CN=client',
            'TLSv1.3',
        );

        expect(authContext.getProperties().get('cipher')).toEqual(['TLS_AES_128_GCM_SHA256']);
        expect(authContext.getPeerCertificates()).toEqual([certificate]);
        expect(authContext.getPeerSubject()).toBe('CN=client');
        expect(authContext.getTransportSecurityType()).toBe('TLSv1.3');
    });

    it('copies its inputs and outputs so callers cannot mutate it', () => {
        const properties = new Map([['cipher', ['a']]]);
        const certificates = [new Certificate(new Uint8Array([1]))];
        const authContext = new AuthContext('ssl', properties, certificates);

        properties.set('added', ['b']);
        (properties.get('cipher') as string[]).push('c');
        certificates.push(new Certificate(new Uint8Array([2])));

        authContext.getProperties().set('also-added', ['d']);
        authContext.getPeerCertificates().push(new Certificate(new Uint8Array([3])));

        expect([...authContext.getProperties().keys()]).toEqual(['cipher']);
        expect(authContext.getProperties().get('cipher')).toEqual(['a']);
        expect(authContext.getPeerCertificates()).toHaveLength(1);
    });

    it('builds an insecure context', () => {
        expect(AuthContext.insecure().getType()).toBe('insecure');
        expect(AuthContext.TYPE_INSECURE).toBe('insecure');
    });
});

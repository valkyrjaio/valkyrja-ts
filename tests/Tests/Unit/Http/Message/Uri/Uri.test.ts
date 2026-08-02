/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Scheme } from '../../../../../../src/Valkyrja/Http/Message/Uri/Enum/Scheme.ts';
import { Uri } from '../../../../../../src/Valkyrja/Http/Message/Uri/Uri.ts';
import { HttpUriInvalidPortException } from '../../../../../../src/Valkyrja/Http/Message/Uri/Throwable/Exception/HttpUriInvalidPortException.ts';

describe('Uri', () => {
    it('derives the default port from the scheme and normalizes the host', () => {
        const uri = new Uri(Scheme.HTTPS, 'user', 'pass', 'Example.com', 0, '/path', 'a=1', 'frag');

        expect(uri.getScheme()).toBe(Scheme.HTTPS);
        expect(uri.isSecure()).toBe(true);
        expect(uri.getHost()).toBe('example.com');
        expect(uri.getUserInfo()).toBe('user:pass');
        expect(uri.getUsername()).toBe('user');
        expect(uri.getPassword()).toBe('pass');
        expect(uri.getPath()).toBe('/path');
        expect(uri.getQuery()).toBe('a=1');
        expect(uri.getFragment()).toBe('frag');
        // 443 is the standard https port, so getPort hides it.
        expect(uri.getPort()).toBe(0);
        expect(uri.getAuthority()).toBe('user:pass@example.com');
    });

    it('keeps a non-standard port in the authority and host:port', () => {
        const uri = new Uri(Scheme.HTTP, '', '', 'example.com', 8080, '/path', 'a=1', 'frag');

        expect(uri.hasPort()).toBe(true);
        expect(uri.getPort()).toBe(8080);
        expect(uri.getHostPort()).toBe('example.com:8080');
        expect(uri.getSchemeHostPort()).toBe('http://example.com:8080');
        expect(uri.getAuthority()).toBe('example.com:8080');
        expect(uri.toString()).toBe('http://example.com:8080/path?a=1#frag');
    });

    it('returns empty authority and defaults for an empty uri', () => {
        const uri = new Uri();

        expect(uri.getScheme()).toBe(Scheme.EMPTY);
        expect(uri.isSecure()).toBe(false);
        expect(uri.getAuthority()).toBe('');
        expect(uri.getHostPort()).toBe('');
        expect(uri.hasPort()).toBe(false);
    });

    it('recomputes the port when changing the scheme of a default-port uri', () => {
        const uri = new Uri(Scheme.HTTP, '', '', 'example.com');

        expect(uri.withScheme(Scheme.HTTPS).isSecure()).toBe(true);
        expect(uri.getScheme()).toBe(Scheme.HTTP);

        // A uri with no scheme has port 0, so changing the scheme recomputes the port.
        const portless = new Uri(Scheme.EMPTY, '', '', 'example.com');
        expect(portless.withScheme(Scheme.HTTPS).isSecure()).toBe(true);
    });

    it('manages user info immutably and clears the password without a user', () => {
        const uri = new Uri(Scheme.HTTP, 'user', 'pass', 'example.com');

        expect(uri.withUsername('other').getUserInfo()).toBe('other:pass');
        expect(uri.withPassword('secret').getUserInfo()).toBe('user:secret');
        expect(uri.withUserInfo('', 'pass').getUserInfo()).toBe('');
    });

    it('manages the remaining components immutably', () => {
        const uri = new Uri(Scheme.HTTP, '', '', 'example.com');

        expect(uri.withHost('other.com').getHost()).toBe('other.com');
        expect(uri.withPort(8443).getPort()).toBe(8443);
        expect(uri.withPath('/new').getPath()).toBe('/new');
        expect(uri.withQuery('b=2').getQuery()).toBe('b=2');
        expect(uri.withFragment('top').getFragment()).toBe('top');
    });

    it('validates ports', () => {
        expect(() => new Uri(Scheme.HTTP, '', '', 'example.com', 70000)).toThrow(HttpUriInvalidPortException);
        expect(() => new Uri(Scheme.HTTP, '', '', 'example.com').withPort(-1)).toThrow(HttpUriInvalidPortException);
    });

    it('builds the scheme-host-port only when both a host and scheme are present', () => {
        expect(new Uri(Scheme.HTTP, '', '', 'example.com').getSchemeHostPort()).toBe('http://example.com');
        expect(new Uri(Scheme.EMPTY, '', '', 'example.com').getSchemeHostPort()).toBe('example.com');
        expect(new Uri(Scheme.HTTP, '', '', '').getSchemeHostPort()).toBe('');
    });

    it('filters the host in withHost the same way as the constructor', () => {
        const uri = new Uri(Scheme.HTTP, '', '', 'example.com');

        expect(uri.withHost('EXAMPLE.COM').getHost()).toBe('example.com');
        expect(uri.withHost('exa mple.com').getHost()).toBe('exa%20mple.com');
        expect(uri.withHost('[::1]').getHost()).toBe('[::1]');
        expect(uri.withHost('EXAMPLE.COM').getHost()).toBe(new Uri(Scheme.HTTP, '', '', 'EXAMPLE.COM').getHost());
    });

    it('filters the user info in withUserInfo the same way as the constructor', () => {
        const uri = new Uri(Scheme.HTTP, '', '', 'example.com');

        expect(uri.withUserInfo('user name', 'p@ss').getUserInfo()).toBe('user%20name:p%40ss');
        // The colon that separates the username from the password stays unencoded.
        expect(uri.withUserInfo('user', 'pass').getUserInfo()).toBe('user:pass');
        // A value that is already encoded is not encoded a second time.
        expect(uri.withUserInfo('us%C3%A9r').getUserInfo()).toBe('us%C3%A9r');
        expect(uri.withUserInfo('user name', 'p@ss').getUserInfo()).toBe(
            new Uri(Scheme.HTTP, 'user name', 'p@ss', 'example.com').getUserInfo(),
        );
    });

    it('encodes every component in the uri string', () => {
        const uri = new Uri(Scheme.HTTPS, 'user', 'p@ss', 'EXAMPLE.com', 0, '/a b', 'q=1 2', 'f g');

        expect(uri.toString()).toBe('https://user:p%40ss@example.com/a%20b?q=1%202#f%20g');
    });
});

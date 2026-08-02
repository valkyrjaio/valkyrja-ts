/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Scheme } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Enum/Scheme.ts';
import { Uri } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Uri.ts';
import { UriFactory } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Factory/UriFactory.ts';
import { HttpUriInvalidFromStringException } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Throwable/Exception/HttpUriInvalidFromStringException.ts';
import { HttpUriInvalidPathException } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Throwable/Exception/HttpUriInvalidPathException.ts';
import { HttpUriInvalidPortException } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Throwable/Exception/HttpUriInvalidPortException.ts';
import { HttpUriInvalidQueryException } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Throwable/Exception/HttpUriInvalidQueryException.ts';

describe('UriFactory', () => {
    it('parses a full url', () => {
        const uri = UriFactory.fromString('http://user:pass@example.com:8080/path?q=1#frag');

        expect(uri.getScheme()).toBe(Scheme.HTTP);
        expect(uri.getHost()).toBe('example.com');
        expect(uri.getPort()).toBe(8080);
        expect(uri.getPath()).toBe('/path');
        expect(uri.getQuery()).toBe('q=1');
        expect(uri.getFragment()).toBe('frag');
    });

    it('treats a bare host as authority with no scheme', () => {
        const uri = UriFactory.fromString('example.com');

        expect(uri.getScheme()).toBe(Scheme.EMPTY);
        expect(uri.getHost()).toBe('example.com');
    });

    it('parses an absolute path', () => {
        const uri = UriFactory.fromString('/path/to/thing');

        expect(uri.getPath()).toBe('/path/to/thing');
    });

    it('throws on an unparseable uri', () => {
        expect(() => UriFactory.fromString('http://[')).toThrow(HttpUriInvalidFromStringException);
    });

    it('serializes a uri with an empty path component', () => {
        const uri = new Uri(Scheme.HTTP, '', '', 'example.com', 8080);

        expect(UriFactory.toString(uri)).toBe('http://example.com:8080');
    });

    it('filters schemes to the known set', () => {
        expect(UriFactory.filterScheme('HTTP')).toBe(Scheme.HTTP);
        expect(UriFactory.filterScheme('https://')).toBe(Scheme.HTTPS);
        expect(UriFactory.filterScheme('ftp')).toBe(Scheme.EMPTY);
    });

    it('validates ports', () => {
        expect(() => {
            UriFactory.validatePort(0);
        }).toThrow(HttpUriInvalidPortException);
        expect(() => {
            UriFactory.validatePort(80);
        }).not.toThrow();
    });

    it('rejects paths containing a query or fragment', () => {
        expect(() => UriFactory.filterPath('/path?x=1')).toThrow(HttpUriInvalidPathException);
        expect(() => UriFactory.filterPath('/path#frag')).toThrow(HttpUriInvalidPathException);
    });

    it('collapses leading slashes in a path', () => {
        expect(UriFactory.filterPath('///path')).toBe('/path');
        expect(UriFactory.filterPath('relative')).toBe('relative');
    });

    it('rejects queries containing a fragment', () => {
        expect(() => UriFactory.filterQuery('a=1#frag')).toThrow(HttpUriInvalidQueryException);
    });

    it.each([
        ['keeps the unreserved characters', 'aZ0-_.~', 'aZ0-_.~'],
        ['keeps the sub delimiters', "!$&'()*+,;=", "!$&'()*+,;="],
        ['keeps the username separator', 'user:pass', 'user:pass'],
        ['encodes a space', 'user name', 'user%20name'],
        ['encodes an at sign', 'user:p@ss', 'user:p%40ss'],
        ['encodes a forward slash', 'user/name', 'user%2Fname'],
        ['encodes a question mark', 'user?name', 'user%3Fname'],
        ['encodes a multibyte character', 'usér', 'us%C3%A9r'],
        ['keeps a valid triplet', 'us%C3%A9r', 'us%C3%A9r'],
        ['uppercases a triplet', 'us%c3%a9r', 'us%C3%A9r'],
        ['encodes a lone percent sign', '100%', '100%25'],
        ['encodes an incomplete triplet', '%2', '%252'],
        ['encodes a non hexadecimal escape', '%zz', '%25zz'],
    ])('filterUserInfo %s', (_name, userInfo, expected) => {
        expect(UriFactory.filterUserInfo(userInfo)).toBe(expected);
    });

    it.each([
        ['keeps the unreserved characters', '/aZ0-_.~', '/aZ0-_.~'],
        ['keeps the sub delimiters', "/!$&'()*+,;=", "/!$&'()*+,;="],
        ['keeps a colon and an at sign', '/a:b@c', '/a:b@c'],
        ['keeps the segment separator', '/a/b/c', '/a/b/c'],
        ['encodes a space', '/foo bar', '/foo%20bar'],
        ['encodes a multibyte character', '/café', '/caf%C3%A9'],
        ['keeps a valid triplet', '/foo%20bar', '/foo%20bar'],
        ['uppercases a triplet', '/foo%2fbar', '/foo%2Fbar'],
        ['encodes a lone percent sign', '/100%/x', '/100%25/x'],
        ['encodes a bracket', '/a[b]c', '/a%5Bb%5Dc'],
        ['normalizes the leading slashes', '///a b', '/a%20b'],
        ['keeps a relative path', 'a b', 'a%20b'],
    ])('filterPath %s', (_name, path, expected) => {
        expect(UriFactory.filterPath(path)).toBe(expected);
    });

    it.each([
        ['keeps the unreserved characters', 'a=Z0-_.~', 'a=Z0-_.~'],
        ['keeps the sub delimiters', "!$&'()*+,;=", "!$&'()*+,;="],
        ['keeps a colon and an at sign', 'a=b:c@d', 'a=b:c@d'],
        ['keeps a slash', 'a=b/c', 'a=b/c'],
        ['keeps an inner question mark', '?a=b?c', 'a=b?c'],
        ['encodes a space', 'a=b c&d=e', 'a=b%20c&d=e'],
        ['encodes a multibyte character', 'a=café', 'a=caf%C3%A9'],
        ['keeps a valid triplet', 'a=%C3%A9', 'a=%C3%A9'],
        ['uppercases a triplet', 'a=%c3%a9', 'a=%C3%A9'],
        ['encodes a lone percent sign', 'a=100%', 'a=100%25'],
        ['encodes a bracket', 'a[]=b', 'a%5B%5D=b'],
    ])('filterQuery %s', (_name, query, expected) => {
        expect(UriFactory.filterQuery(query)).toBe(expected);
    });

    it.each([
        ['keeps the unreserved characters', 'aZ0-_.~', 'aZ0-_.~'],
        ['keeps a colon and an at sign', 'a:b@c', 'a:b@c'],
        ['keeps a slash and a question', 'a/b?c', 'a/b?c'],
        ['encodes a space', '#a b', 'a%20b'],
        ['encodes a multibyte character', 'café', 'caf%C3%A9'],
        ['keeps a valid triplet', '%C3%A9', '%C3%A9'],
        ['uppercases a triplet', '%c3%a9', '%C3%A9'],
        ['encodes a lone percent sign', '100%', '100%25'],
    ])('filterFragment %s', (_name, fragment, expected) => {
        expect(UriFactory.filterFragment(fragment)).toBe(expected);
    });

    it.each([
        ['lowercases the reg name', 'EXAMPLE.COM', 'example.com'],
        ['keeps the sub delimiters', "a!$&'()*+,;=b", "a!$&'()*+,;=b"],
        ['encodes a space', 'exa mple.com', 'exa%20mple.com'],
        ['encodes a colon', 'example.com:x', 'example.com%3Ax'],
        ['encodes a multibyte character', 'café.com', 'caf%C3%A9.com'],
        ['keeps a valid triplet', 'caf%C3%A9.com', 'caf%C3%A9.com'],
        ['encodes a lone percent sign', '100%.com', '100%25.com'],
        ['is empty for an empty host', '', ''],
    ])('filterHost %s', (_name, host, expected) => {
        expect(UriFactory.filterHost(host)).toBe(expected);
    });

    it('keeps an ip literal host unencoded', () => {
        expect(UriFactory.filterHost('[::1]')).toBe('[::1]');
        expect(UriFactory.filterHost('[2001:DB8::FF00:42:8329]')).toBe('[2001:db8::ff00:42:8329]');
        // A bracket on one side only does not make an IP literal, so the value is a reg-name.
        expect(UriFactory.filterHost('[::1')).toBe('%5B%3A%3A1');
        expect(UriFactory.filterHost('::1]')).toBe('%3A%3A1%5D');
    });

    it('filters idempotently', () => {
        const path = UriFactory.filterPath('/foo bar/100%');
        const query = UriFactory.filterQuery('a=b c&d=100%');
        const fragment = UriFactory.filterFragment('a b 100%');
        const userInfo = UriFactory.filterUserInfo('user:p@ss word');
        const host = UriFactory.filterHost('exa mple.com');

        expect(UriFactory.filterPath(path)).toBe(path);
        expect(UriFactory.filterQuery(query)).toBe(query);
        expect(UriFactory.filterFragment(fragment)).toBe(fragment);
        expect(UriFactory.filterUserInfo(userInfo)).toBe(userInfo);
        expect(UriFactory.filterHost(host)).toBe(host);
    });

    it('recognizes standard ports', () => {
        expect(UriFactory.isStandardPort(Scheme.HTTP, 'example.com', 80)).toBe(true);
        expect(UriFactory.isStandardPort(Scheme.HTTPS, 'example.com', 443)).toBe(true);
        expect(UriFactory.isStandardPort(Scheme.HTTP, 'example.com', 8080)).toBe(false);
        expect(UriFactory.isStandardPort(Scheme.EMPTY, 'example.com', 0)).toBe(true);
        expect(UriFactory.isStandardPort(Scheme.HTTP, '', 0)).toBe(true);
    });

    it('uses an empty scheme for a protocol-relative uri', () => {
        expect(UriFactory.fromString('//example.com/path').getScheme()).toBe(Scheme.EMPTY);
    });

    it('treats an empty uri as having an empty path', () => {
        expect(UriFactory.fromString('').getPath()).toBe('');
    });

    it('renders the path string part with a leading slash', () => {
        expect(UriFactory.getPathStringPart(new Uri(Scheme.HTTP, '', '', 'host', 0, '/abs'))).toBe('/abs');
        expect(UriFactory.getPathStringPart(new Uri(Scheme.HTTP, '', '', 'host', 0, 'relative'))).toBe('/relative');
        expect(UriFactory.getPathStringPart(new Uri(Scheme.HTTP, '', '', 'host', 0, ''))).toBe('');
    });
});

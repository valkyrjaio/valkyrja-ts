/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
        expect(() => UriFactory.validatePort(0)).toThrow(HttpUriInvalidPortException);
        expect(() => UriFactory.validatePort(80)).not.toThrow();
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

    it('recognizes standard ports', () => {
        expect(UriFactory.isStandardPort(Scheme.HTTP, 'example.com', 80)).toBe(true);
        expect(UriFactory.isStandardPort(Scheme.HTTPS, 'example.com', 443)).toBe(true);
        expect(UriFactory.isStandardPort(Scheme.HTTP, 'example.com', 8080)).toBe(false);
        expect(UriFactory.isStandardPort(Scheme.EMPTY, 'example.com', 0)).toBe(true);
        expect(UriFactory.isStandardPort(Scheme.HTTP, '', 0)).toBe(true);
    });
});

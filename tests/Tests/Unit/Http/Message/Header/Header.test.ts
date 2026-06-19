/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Header } from '../../../../../../src/Valkyrja/Http/Message/Header/Header.ts';
import { HttpHeaderInvalidNameException } from '../../../../../../src/Valkyrja/Http/Message/Header/Throwable/Exception/HttpHeaderInvalidNameException.ts';

describe('Header', () => {
    it('stores the name and its normalized form', () => {
        const header = new Header('Content-Type', 'text/html');

        expect(header.getName()).toBe('Content-Type');
        expect(header.getNormalizedName()).toBe('content-type');
        expect(header.getValues()).toStrictEqual(['text/html']);
    });

    it('rejects invalid names', () => {
        expect(() => new Header('Bad Name')).toThrow(HttpHeaderInvalidNameException);
        expect(() => new Header('Valid').withName('Bad Name')).toThrow(HttpHeaderInvalidNameException);
    });

    it('parses a header from a raw "name: a, b" string', () => {
        const header = Header.fromValue('Accept: text/html, application/json');

        expect(header.getName()).toBe('Accept');
        expect(header.getValues()).toStrictEqual(['text/html', 'application/json']);
    });

    it('parses a header with no colon as a name with a single empty value', () => {
        const header = Header.fromValue('X-Custom');

        expect(header.getName()).toBe('X-Custom');
        expect(header.getValues()).toStrictEqual(['']);
    });

    it('manages name and values immutably', () => {
        const header = new Header('X-Test', 'a');

        expect(header.withName('X-Other').getName()).toBe('X-Other');
        expect(header.withValues('b').getValues()).toStrictEqual(['b']);
        expect(header.withAddedValues('b', 'c').getValues()).toStrictEqual(['a', 'b', 'c']);
    });

    it('renders a header line, skipping empty values', () => {
        const header = new Header('Accept', 'text/html', '', 'application/json');

        expect(header.getHeaderLine()).toBe('Accept: text/html, application/json');
        expect(header.toString()).toBe('Accept: text/html, application/json');
    });

    it('passes value objects through and stringifies them in the header line', () => {
        const value = { toString: (): string => 'application/json' };
        const header = new Header('Accept', value);

        expect(header.getValues()).toStrictEqual([value]);
        expect(header.getHeaderLine()).toBe('Accept: application/json');
    });
});

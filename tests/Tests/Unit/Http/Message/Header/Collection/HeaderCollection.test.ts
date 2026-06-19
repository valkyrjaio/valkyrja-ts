/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HeaderCollection } from '../../../../../../../src/Valkyrja/Http/Message/Header/Collection/HeaderCollection.ts';
import { Header } from '../../../../../../../src/Valkyrja/Http/Message/Header/Header.ts';
import { HttpHeaderInvalidHeaderNameException } from '../../../../../../../src/Valkyrja/Http/Message/Header/Throwable/Exception/HttpHeaderInvalidHeaderNameException.ts';
import { HttpHeaderInvalidHeaderParamException } from '../../../../../../../src/Valkyrja/Http/Message/Header/Throwable/Exception/HttpHeaderInvalidHeaderParamException.ts';

const accept = new Header('Accept', 'text/html');
const contentType = new Header('Content-Type', 'application/json');

describe('HeaderCollection', () => {
    it('looks up headers case-insensitively', () => {
        const collection = new HeaderCollection(accept, contentType);

        expect(collection.has('accept')).toBe(true);
        expect(collection.has('Missing')).toBe(false);
        expect(collection.get('ACCEPT')).toBe(accept);
        expect(() => collection.get('Missing')).toThrow(HttpHeaderInvalidHeaderNameException);
    });

    it('returns a header line, or empty for a missing header', () => {
        const collection = new HeaderCollection(accept);

        expect(collection.getHeaderLine('Accept')).toBe('Accept: text/html');
        expect(collection.getHeaderLine('Missing')).toBe('');
    });

    it('filters headers with getAll, getOnly, and getAllExcept', () => {
        const collection = new HeaderCollection(accept, contentType);

        expect(Object.keys(collection.getAll())).toHaveLength(2);
        expect(Object.keys(collection.getOnly('Accept'))).toStrictEqual(['accept']);
        expect(Object.keys(collection.getAllExcept('Accept'))).toStrictEqual(['content-type']);
    });

    it('builds a collection from an array, rejecting non-headers', () => {
        expect(HeaderCollection.fromArray({ a: accept }).has('Accept')).toBe(true);
        expect(() => HeaderCollection.fromArray({ a: 'nope' })).toThrow(HttpHeaderInvalidHeaderParamException);
    });

    it('adds and removes headers immutably', () => {
        const collection = new HeaderCollection(accept);

        expect(collection.withHeader(contentType).has('Content-Type')).toBe(true);
        expect(collection.has('Content-Type')).toBe(false);
        expect(collection.withoutHeader('Accept').has('Accept')).toBe(false);
        expect(collection.withHeaders(contentType).has('Accept')).toBe(false);
        expect(collection.withAddedHeaders(contentType).has('Accept')).toBe(true);
    });
});

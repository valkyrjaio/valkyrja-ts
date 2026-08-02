/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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

        expect(collection.getHeaderLine('Accept')).toBe('text/html');
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

    it('merges values into an existing header when adding, and appends a new one as-is', () => {
        const collection = new HeaderCollection(accept);

        // A header whose name is already present merges its values into the existing header.
        const merged = collection.withAddedHeaders(new Header('ACCEPT', 'application/json'));

        expect(merged.getHeaderLine('Accept')).toBe('text/html, application/json');
        expect(merged.get('Accept').getValues()).toStrictEqual(['text/html', 'application/json']);

        // A header whose name is absent is stored as-is.
        expect(merged.has('Content-Type')).toBe(false);
        expect(collection.withAddedHeaders(contentType).getHeaderLine('Content-Type')).toBe('application/json');

        // The original collection is untouched.
        expect(collection.getHeaderLine('Accept')).toBe('text/html');
    });

    it('keeps every value of a repeatedly added header', () => {
        const collection = new HeaderCollection().withAddedHeaders(
            new Header('Set-Cookie', 'sid=abc'),
            new Header('Set-Cookie', 'theme=dark'),
        );

        expect(collection.get('Set-Cookie').getValues()).toStrictEqual(['sid=abc', 'theme=dark']);
    });
});

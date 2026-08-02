/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { QueryParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/QueryParamCollection.ts';

describe('QueryParamCollection', () => {
    it('reads parameters', () => {
        const collection = new QueryParamCollection({ a: '1', b: '2' });

        expect(collection.has('a')).toBe(true);
        expect(collection.has('z')).toBe(false);
        expect(collection.get('a')).toBe('1');
        expect(collection.get('z')).toBeUndefined();
        expect(collection.getAll()).toStrictEqual({ a: '1', b: '2' });
    });

    it('filters parameters with getOnly and getAllExcept', () => {
        const collection = new QueryParamCollection({ a: '1', b: '2', c: '3' });

        expect(collection.getOnly('a', 'b')).toStrictEqual({ a: '1', b: '2' });
        expect(collection.getAllExcept('a')).toStrictEqual({ b: '2', c: '3' });
    });

    it('replaces and merges parameters immutably', () => {
        const collection = new QueryParamCollection({ a: '1' });

        expect(collection.with({ b: '2' }).getAll()).toStrictEqual({ b: '2' });
        expect(collection.withAdded({ b: '2' }).getAll()).toStrictEqual({ a: '1', b: '2' });
        expect(collection.getAll()).toStrictEqual({ a: '1' });
    });

    it('defaults to an empty collection', () => {
        expect(new QueryParamCollection().getAll()).toStrictEqual({});
    });
});

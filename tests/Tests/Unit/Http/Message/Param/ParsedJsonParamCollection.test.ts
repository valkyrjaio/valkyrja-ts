/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ParsedJsonParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/ParsedJsonParamCollection.ts';

describe('ParsedJsonParamCollection', () => {
    it('defaults to an empty collection and stores parameters', () => {
        expect(new ParsedJsonParamCollection().getAll()).toStrictEqual({});
        expect(new ParsedJsonParamCollection({ a: 1 }).get('a')).toBe(1);
    });
});

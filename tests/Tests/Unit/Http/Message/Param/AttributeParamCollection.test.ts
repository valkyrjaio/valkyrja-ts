/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { AttributeParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/AttributeParamCollection.ts';

describe('AttributeParamCollection', () => {
    it('defaults to an empty collection and stores parameters', () => {
        expect(new AttributeParamCollection().getAll()).toStrictEqual({});
        expect(new AttributeParamCollection({ a: 1 }).get('a')).toBe(1);
    });
});

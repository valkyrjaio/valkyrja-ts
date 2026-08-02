/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ResponseStruct } from '../../../../../../../src/Valkyrja/Http/Struct/Response/Abstract/ResponseStruct.ts';

class TestResponseStruct extends ResponseStruct {
    readonly name = 'test';
    readonly value = null;
}

describe('ResponseStruct', () => {
    it('maps the configured fields to their output keys, defaulting missing values to null', () => {
        const struct = new TestResponseStruct({ firstName: 'first_name', age: 'age' });

        expect(struct.getStructuredData({ firstName: 'Jane' })).toStrictEqual({ first_name: 'Jane', age: null });
    });

    it('omits fields not present in the data when not including all', () => {
        const struct = new TestResponseStruct({ firstName: 'first_name', age: 'age' });

        expect(struct.getStructuredData({ firstName: 'Jane' }, false)).toStrictEqual({ first_name: 'Jane' });
    });
});

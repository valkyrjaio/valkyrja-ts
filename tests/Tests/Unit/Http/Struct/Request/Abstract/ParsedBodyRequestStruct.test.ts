/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ParsedBodyParamCollection } from '../../../../../../../src/Valkyrja/Http/Message/Param/ParsedBodyParamCollection.ts';
import { ServerRequest } from '../../../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { ParsedBodyRequestStruct } from '../../../../../../../src/Valkyrja/Http/Struct/Request/Abstract/ParsedBodyRequestStruct.ts';

class TestParsedBodyStruct extends ParsedBodyRequestStruct {
    readonly name = 'test';
    readonly value = null;
}

const request = new ServerRequest().withParsedBody(new ParsedBodyParamCollection({ a: '1', b: '2' }));

describe('ParsedBodyRequestStruct', () => {
    it('reads only the configured parsed-body parameters', () => {
        expect(new TestParsedBodyStruct(['a']).getDataFromRequest(request)).toStrictEqual({ a: '1' });
    });

    it('detects extra parsed-body parameters', () => {
        expect(new TestParsedBodyStruct(['a']).determineIfRequestContainsExtraData(request)).toBe(true);
    });
});

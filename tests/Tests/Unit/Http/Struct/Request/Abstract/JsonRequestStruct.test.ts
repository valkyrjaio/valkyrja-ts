/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ParsedJsonParamCollection } from '../../../../../../../src/Valkyrja/Http/Message/Param/ParsedJsonParamCollection.ts';
import { JsonServerRequest } from '../../../../../../../src/Valkyrja/Http/Message/Request/JsonServerRequest.ts';
import { JsonRequestStruct } from '../../../../../../../src/Valkyrja/Http/Struct/Request/Abstract/JsonRequestStruct.ts';
import { HttpStructJsonServerRequestExpectedException } from '../../../../../../../src/Valkyrja/Http/Struct/Throwable/Exception/HttpStructJsonServerRequestExpectedException.ts';

import type { ServerRequestContract } from '../../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';

class TestJsonStruct extends JsonRequestStruct {
    readonly name = 'test';
    readonly value = null;
}

const jsonRequest = new JsonServerRequest().withParsedJson(new ParsedJsonParamCollection({ a: 1, b: 2 }));

describe('JsonRequestStruct', () => {
    it('reads only the configured parsed-json parameters', () => {
        expect(new TestJsonStruct(['a']).getDataFromRequest(jsonRequest)).toStrictEqual({ a: 1 });
    });

    it('detects extra parsed-json parameters', () => {
        expect(new TestJsonStruct(['a']).determineIfRequestContainsExtraData(jsonRequest)).toBe(true);
    });

    it('requires a json server request', () => {
        const plainRequest = {} as ServerRequestContract;

        expect(() => new TestJsonStruct(['a']).getDataFromRequest(plainRequest)).toThrow(
            HttpStructJsonServerRequestExpectedException,
        );
    });
});

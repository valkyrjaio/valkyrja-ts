/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

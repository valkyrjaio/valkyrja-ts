/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { QueryParamCollection } from '../../../../../../../src/Valkyrja/Http/Message/Param/QueryParamCollection.ts';
import { ServerRequest } from '../../../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { QueryRequestStruct } from '../../../../../../../src/Valkyrja/Http/Struct/Request/Abstract/QueryRequestStruct.ts';

class TestQueryStruct extends QueryRequestStruct {
    readonly name = 'test';
    readonly value = null;
}

const request = new ServerRequest().withQueryParams(new QueryParamCollection({ a: '1', b: '2', c: '3' }));

describe('QueryRequestStruct', () => {
    it('reads only the configured query parameters', () => {
        expect(new TestQueryStruct(['a', 'b']).getDataFromRequest(request)).toStrictEqual({ a: '1', b: '2' });
    });

    it('detects extra query parameters beyond the configured fields', () => {
        expect(new TestQueryStruct(['a']).determineIfRequestContainsExtraData(request)).toBe(true);
        expect(new TestQueryStruct(['a', 'b', 'c']).determineIfRequestContainsExtraData(request)).toBe(false);
    });
});

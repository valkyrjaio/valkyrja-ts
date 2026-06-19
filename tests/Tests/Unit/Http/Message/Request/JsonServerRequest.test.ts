/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ContentTypeValue } from '../../../../../../src/Valkyrja/Http/Message/Constant/ContentTypeValue.ts';
import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { HeaderCollection } from '../../../../../../src/Valkyrja/Http/Message/Header/Collection/HeaderCollection.ts';
import { Header } from '../../../../../../src/Valkyrja/Http/Message/Header/Header.ts';
import { ParsedJsonParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/ParsedJsonParamCollection.ts';
import { JsonServerRequest } from '../../../../../../src/Valkyrja/Http/Message/Request/JsonServerRequest.ts';
import { Stream } from '../../../../../../src/Valkyrja/Http/Message/Stream/Stream.ts';
import { Uri } from '../../../../../../src/Valkyrja/Http/Message/Uri/Uri.ts';

function jsonRequest(body: string, contentType = ContentTypeValue.APPLICATION_JSON): JsonServerRequest {
    return new JsonServerRequest(
        new Uri(),
        RequestMethod.POST,
        new Stream(body),
        new HeaderCollection(new Header(HeaderName.CONTENT_TYPE, contentType)),
    );
}

describe('JsonServerRequest', () => {
    it('parses a JSON body when the content type is JSON', () => {
        expect(jsonRequest('{"a":1}').getParsedJson().get('a')).toBe(1);
    });

    it('leaves the parsed JSON empty for an empty body', () => {
        expect(jsonRequest('').getParsedJson().getAll()).toStrictEqual({});
    });

    it('does not parse when the content type is not JSON', () => {
        expect(jsonRequest('{"a":1}', 'text/plain').getParsedJson().getAll()).toStrictEqual({});
    });

    it('defaults to an empty parsed JSON collection', () => {
        expect(new JsonServerRequest().getParsedJson().getAll()).toStrictEqual({});
    });

    it('replaces the parsed JSON immutably', () => {
        const request = new JsonServerRequest().withParsedJson(new ParsedJsonParamCollection({ b: 2 }));

        expect(request.getParsedJson().get('b')).toBe(2);
    });
});

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ProtocolVersion } from '../../../../../../../src/Valkyrja/Http/Message/Enum/ProtocolVersion.ts';
import { RequestMethod } from '../../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { JsonServerRequest } from '../../../../../../../src/Valkyrja/Http/Message/Request/JsonServerRequest.ts';
import { ServerRequest } from '../../../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { RequestFactory } from '../../../../../../../src/Valkyrja/Http/Message/Request/Factory/RequestFactory.ts';

import type { IncomingMessage } from 'node:http';

function nodeRequest(
    overrides: Partial<IncomingMessage> & { headers?: Record<string, unknown>; socket?: object } = {},
): IncomingMessage {
    return {
        headers: {
            host: 'example.com',
            cookie: 'session=abc',
            'x-test': 'value',
            'x-multi': ['a', 'b'],
            'x-null': null,
        },
        socket: {},
        url: '/path?q=1&q=2&q=3&single=x',
        method: 'GET',
        httpVersion: '1.1',
        ...overrides,
    } as unknown as IncomingMessage;
}

describe('RequestFactory', () => {
    it('builds a server request from a node request', () => {
        const request = RequestFactory.fromNodeRequest(nodeRequest());

        expect(request).toBeInstanceOf(ServerRequest);
        expect(request.getMethod()).toBe(RequestMethod.GET);
        expect(request.getUri().getHost()).toBe('example.com');
        expect(request.getCookieParams().get('session')).toBe('abc');
        expect(request.getQueryParams().get('q')).toStrictEqual(['1', '2', '3']);
        expect(request.getQueryParams().get('single')).toBe('x');
        expect(request.getHeaders().has('x-multi')).toBe(true);
        expect(request.getHeaders().has('x-null')).toBe(false);
    });

    it('builds a json server request', () => {
        expect(RequestFactory.jsonFromNodeRequest(nodeRequest())).toBeInstanceOf(JsonServerRequest);
    });

    it('uses https when the socket is encrypted', () => {
        const request = RequestFactory.fromNodeRequest(nodeRequest({ socket: { encrypted: true } as object }));

        expect(request.getUri().isSecure()).toBe(true);
    });

    it('defaults the host and url when missing', () => {
        const request = RequestFactory.fromNodeRequest(nodeRequest({ headers: {}, url: undefined, method: undefined }));

        expect(request.getUri().getHost()).toBe('localhost');
    });

    it.each([
        ['1.0', ProtocolVersion.V1],
        ['2.0', ProtocolVersion.V2],
        ['3.0', ProtocolVersion.V3],
        ['1.1', ProtocolVersion.V1_1],
    ])('maps http version %s to a protocol', (httpVersion, protocol) => {
        const request = RequestFactory.fromNodeRequest(nodeRequest({ httpVersion }));

        expect(request.getProtocolVersion()).toBe(protocol);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ProtocolVersion } from '../../../../../../src/Valkyrja/Http/Message/Enum/ProtocolVersion.ts';
import { StatusCode, statusCodeAsPhrase } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { StatusText } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusText.ts';
import { HeaderCollection } from '../../../../../../src/Valkyrja/Http/Message/Header/Collection/HeaderCollection.ts';
import { Header } from '../../../../../../src/Valkyrja/Http/Message/Header/Header.ts';
import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { Stream } from '../../../../../../src/Valkyrja/Http/Message/Stream/Stream.ts';

/**
 * Every status code the StatusCode enum defines, paired with its name.
 *
 * A numeric TypeScript enum carries a reverse mapping, so the numeric-valued
 * entries are the cases and the string-valued ones are the reverse lookups.
 */
const statusCodeCases: Array<[string, StatusCode]> = Object.entries(StatusCode)
    .filter((entry): entry is [string, StatusCode] => typeof entry[1] === 'number')
    .map(([name, code]) => [name, code]);

/** A representative code from each status class. */
const representativeStatusCodes: Array<[string, StatusCode, number, string]> = [
    ['informational', StatusCode.CONTINUE, 100, 'Continue'],
    ['successful', StatusCode.OK, 200, 'OK'],
    ['created', StatusCode.CREATED, 201, 'Created'],
    ['no content', StatusCode.NO_CONTENT, 204, 'No Content'],
    ['redirection', StatusCode.MOVED_PERMANENTLY, 301, 'Moved Permanently'],
    ['not modified', StatusCode.NOT_MODIFIED, 304, 'Not Modified'],
    ['client error', StatusCode.NOT_FOUND, 404, 'Not Found'],
    ['unauthorized', StatusCode.UNAUTHORIZED, 401, 'Unauthorized'],
    ['server error', StatusCode.INTERNAL_SERVER_ERROR, 500, 'Internal Server Error'],
];

/**
 * Message-mapping fidelity for an outgoing HTTP response.
 *
 * Asserts that a status code, headers, and body land on the framework's own
 * Response object and round-trip back out unchanged — including the
 * StatusCode to reason-phrase mapping across every defined code.
 */
describe('Response mapping (functional)', () => {
    it.each(statusCodeCases)('%s resolves to the reason phrase its StatusText twin defines', (name, statusCode) => {
        const statusText = StatusText[name as keyof typeof StatusText];

        const response = new Response(new Stream(), statusCode);

        expect(response.getStatusCode()).toBe(statusCode);
        expect(statusCodeAsPhrase(statusCode).toString()).toBe(statusText);
        expect(response.getReasonPhrase()).toBe(statusText);
    });

    it.each(representativeStatusCodes)(
        '%s exposes its numeric code and phrase',
        (_label, statusCode, expectedCode, expectedPhrase) => {
            const response = new Response(new Stream(), statusCode);

            expect(response.getStatusCode()).toBe(expectedCode);
            expect(response.getReasonPhrase()).toBe(expectedPhrase);
        },
    );

    it('swaps the reason phrase along with the status code', () => {
        const response = new Response(new Stream(), StatusCode.OK);
        const updated = response.withStatusCode(StatusCode.IM_USED);

        expect(response.getStatusCode()).toBe(StatusCode.OK);
        expect(response.getReasonPhrase()).toBe('OK');
        expect(updated.getStatusCode()).toBe(StatusCode.IM_USED);
        expect(updated.getReasonPhrase()).toBe('IM Used');
    });

    it('lets a custom reason phrase override the default without changing the code', () => {
        const response = new Response(new Stream(), StatusCode.NOT_FOUND);
        const custom = response.withReasonPhrase('Totally Missing');
        const restored = custom.withReasonPhrase('');

        expect(response.getReasonPhrase()).toBe('Not Found');
        expect(custom.getReasonPhrase()).toBe('Totally Missing');
        expect(custom.getStatusCode()).toBe(StatusCode.NOT_FOUND);
        expect(restored.getReasonPhrase()).toBe('Not Found');
    });

    it('round-trips headers case-insensitively', () => {
        const response = new Response(
            new Stream(),
            StatusCode.OK,
            new HeaderCollection(
                new Header('Content-Type', 'application/json'),
                new Header('Cache-Control', 'no-cache', 'no-store'),
            ),
        );

        const headers = response.getHeaders();

        expect(Object.keys(headers.getAll())).toStrictEqual(['content-type', 'cache-control']);
        expect(headers.has('CONTENT-TYPE')).toBe(true);
        expect(headers.getHeaderLine('Content-Type')).toBe('application/json');
        expect(headers.getHeaderLine('cache-control')).toBe('no-cache, no-store');
        expect(headers.get('Cache-Control').getValues()).toStrictEqual(['no-cache', 'no-store']);

        const added = response.withHeaders(headers.withAddedHeaders(new Header('CACHE-CONTROL', 'must-revalidate')));

        expect(added.getHeaders().getHeaderLine('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
        expect(response.getHeaders().getHeaderLine('Cache-Control')).toBe('no-cache, no-store');

        const removed = response.withHeaders(headers.withoutHeader('Content-Type'));

        expect(removed.getHeaders().has('content-type')).toBe(false);
        expect(removed.getHeaders().getHeaderLine('Content-Type')).toBe('');
    });

    it('round-trips a body supplied to the constructor', () => {
        const body = new Stream();
        body.write('{"ok":true}');
        body.rewind();

        const response = new Response(body, StatusCode.OK);

        expect(response.getBody().getContents()).toBe('{"ok":true}');
        expect(response.getBody().toString()).toBe('{"ok":true}');
    });

    it('writes content into a rewound body stream through the create factory', () => {
        const response = Response.create(
            'plain content',
            StatusCode.ACCEPTED,
            new HeaderCollection(new Header('X-Trace', 'abc')),
        );

        expect(response.getBody().getContents()).toBe('plain content');
        expect(response.getStatusCode()).toBe(StatusCode.ACCEPTED);
        expect(response.getReasonPhrase()).toBe('Accepted');
        expect(response.getHeaders().getHeaderLine('x-trace')).toBe('abc');
    });

    it('yields an empty 200 response from create() with no arguments', () => {
        const response = Response.create();

        expect(response.getBody().getContents()).toBe('');
        expect(response.getStatusCode()).toBe(StatusCode.OK);
        expect(response.getReasonPhrase()).toBe('OK');
        expect(response.getHeaders().getAll()).toStrictEqual({});
        expect(response.getProtocolVersion()).toBe(ProtocolVersion.V1_1);
    });

    it('leaves the original untouched when the body is swapped', () => {
        const response = Response.create('original');

        const replacement = new Stream();
        replacement.write('replacement');
        replacement.rewind();

        const updated = response.withBody(replacement);

        expect(updated.getBody().toString()).toBe('replacement');
        expect(response.getBody().toString()).toBe('original');
    });

    it('round-trips the protocol version', () => {
        const response = Response.create();
        const updated = response.withProtocolVersion(ProtocolVersion.V2);

        expect(response.getProtocolVersion()).toBe(ProtocolVersion.V1_1);
        expect(updated.getProtocolVersion()).toBe(ProtocolVersion.V2);
    });
});

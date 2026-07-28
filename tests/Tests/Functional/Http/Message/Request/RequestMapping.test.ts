/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { ProtocolVersion } from '../../../../../../src/Valkyrja/Http/Message/Enum/ProtocolVersion.ts';
import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { HeaderCollection } from '../../../../../../src/Valkyrja/Http/Message/Header/Collection/HeaderCollection.ts';
import { Header } from '../../../../../../src/Valkyrja/Http/Message/Header/Header.ts';
import { CookieParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/CookieParamCollection.ts';
import { ParsedBodyParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/ParsedBodyParamCollection.ts';
import { QueryParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/QueryParamCollection.ts';
import { ServerParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/ServerParamCollection.ts';
import { RequestFactory } from '../../../../../../src/Valkyrja/Http/Message/Request/Factory/RequestFactory.ts';
import { ServerRequest } from '../../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { Stream } from '../../../../../../src/Valkyrja/Http/Message/Stream/Stream.ts';
import { Scheme } from '../../../../../../src/Valkyrja/Http/Message/Uri/Enum/Scheme.ts';
import { Uri } from '../../../../../../src/Valkyrja/Http/Message/Uri/Uri.ts';
import { NodeRequestFixture } from '../../../../Fixtures/Http/Message/Request/NodeRequestFixture.ts';

/** Every method the RequestMethod enum defines. */
const requestMethods: Array<[RequestMethod]> = Object.values(RequestMethod).map((method) => [method]);

/** Every http version spelling the factory maps, plus the fallback. */
const protocolVersions: Array<[string, ProtocolVersion]> = [
    ['1.0', ProtocolVersion.V1],
    ['1.1', ProtocolVersion.V1_1],
    ['2', ProtocolVersion.V2],
    ['2.0', ProtocolVersion.V2],
    ['3', ProtocolVersion.V3],
    ['3.0', ProtocolVersion.V3],
    ['0.9', ProtocolVersion.V1_1],
];

/** Request-target shapes, as spelled in the raw node request url. */
const requestTargets: Array<[string, string]> = [
    ['/users/42', '/users/42'],
    ['/users/42?page=2', '/users/42?page=2'],
    ['/', '/'],
];

/**
 * Message-mapping fidelity for an incoming HTTP request.
 *
 * Asserts that the raw request input — a native node `IncomingMessage`, the
 * TypeScript port's counterpart to PHP's `$_SERVER` superglobal — lands on the
 * framework's own ServerRequest object exactly as supplied, independent of
 * routing.
 */
describe('Request mapping (functional)', () => {
    it.each(requestMethods)('maps the %s method from the raw request', (method) => {
        const request = RequestFactory.fromNodeRequest(NodeRequestFixture.make({ method }));

        expect(request.getMethod()).toBe(method);
    });

    it.each(requestMethods)('round-trips the %s method without touching the original', (method) => {
        const request = new ServerRequest();
        const updated = request.withMethod(method);

        expect(request.getMethod()).toBe(RequestMethod.GET);
        expect(updated.getMethod()).toBe(method);
    });

    it.each(protocolVersions)('maps the http version %s onto the protocol enum', (httpVersion, expected) => {
        const request = RequestFactory.fromNodeRequest(NodeRequestFixture.make({ httpVersion }));

        expect(request.getProtocolVersion()).toBe(expected);
    });

    it.each(requestTargets)('maps the url %s onto the request target', (url, expected) => {
        const request = RequestFactory.fromNodeRequest(NodeRequestFixture.make({ url }));

        expect(request.getRequestTarget()).toBe(expected);
    });

    it('maps a fully populated raw request onto every uri component', () => {
        const request = RequestFactory.fromNodeRequest(
            NodeRequestFixture.make({
                method: RequestMethod.POST,
                url: '/users/42/edit?page=2&sort=name',
                headers: { host: 'example.com:8443' },
                encrypted: true,
            }),
        );

        const uri = request.getUri();

        expect(request.getMethod()).toBe(RequestMethod.POST);
        expect(uri.getScheme()).toBe(Scheme.HTTPS);
        expect(uri.isSecure()).toBe(true);
        expect(uri.getHost()).toBe('example.com');
        expect(uri.getPort()).toBe(8443);
        expect(uri.getPath()).toBe('/users/42/edit');
        expect(uri.getQuery()).toBe('page=2&sort=name');
        expect(uri.getFragment()).toBe('');
        expect(uri.toString()).toBe('https://example.com:8443/users/42/edit?page=2&sort=name');
        expect(request.getRequestTarget()).toBe('/users/42/edit?page=2&sort=name');
    });

    it('falls back to an http scheme and a localhost host when no host header is present', () => {
        const request = RequestFactory.fromNodeRequest(NodeRequestFixture.make({ url: '/health' }));

        const uri = request.getUri();

        expect(uri.getScheme()).toBe(Scheme.HTTP);
        expect(uri.isSecure()).toBe(false);
        expect(uri.getHost()).toBe('localhost');
        expect(uri.getPort()).toBe(0);
        expect(request.getHeaders().getHeaderLine(HeaderName.HOST)).toBe('localhost');
    });

    it('carries a fragment through when the url has no query string', () => {
        const request = RequestFactory.fromNodeRequest(NodeRequestFixture.make({ url: '/docs#section' }));

        expect(request.getUri().getPath()).toBe('/docs');
        expect(request.getUri().getFragment()).toBe('section');
    });

    it('marshals raw headers onto the collection and looks them up case-insensitively', () => {
        const request = RequestFactory.fromNodeRequest(
            NodeRequestFixture.make({
                headers: {
                    host: 'example.com',
                    accept: 'text/html',
                    'x-custom-key': 'custom-value',
                    'content-type': 'application/json',
                    'content-length': '42',
                },
            }),
        );

        const headers = request.getHeaders();

        // Header names are normalized to lower case, in the order they appear on the raw request.
        expect(Object.keys(headers.getAll())).toStrictEqual([
            'host',
            'accept',
            'x-custom-key',
            'content-type',
            'content-length',
        ]);

        expect(headers.has('Accept')).toBe(true);
        expect(headers.has('ACCEPT')).toBe(true);
        expect(headers.has('accept')).toBe(true);
        expect(headers.getHeaderLine('AcCePt')).toBe('text/html');
        expect(headers.getHeaderLine('X-Custom-Key')).toBe('custom-value');
        expect(headers.getHeaderLine('Content-Type')).toBe('application/json');
        expect(headers.getHeaderLine('CONTENT-LENGTH')).toBe('42');

        expect(headers.has('Not-A-Header')).toBe(false);
        expect(headers.getHeaderLine('Not-A-Header')).toBe('');
    });

    it('skips a raw header with no value', () => {
        const request = RequestFactory.fromNodeRequest(
            NodeRequestFixture.make({ headers: { 'x-present': 'yes', 'x-absent': undefined } }),
        );

        expect(request.getHeaders().has('x-present')).toBe(true);
        expect(request.getHeaders().has('x-absent')).toBe(false);
    });

    it('joins a repeated raw header into a single comma-delimited value', () => {
        // `set-cookie` is the header node hands over as an array — every other repeated
        // header it has already folded into one comma-delimited string by this point.
        const request = RequestFactory.fromNodeRequest(
            NodeRequestFixture.make({ headers: { 'set-cookie': ['sid=abc', 'theme=dark'] } }),
        );

        const setCookie = request.getHeaders().get('set-cookie');

        expect(setCookie.getHeaderLine()).toBe('sid=abc, theme=dark');
        // The raw values are joined before the Header is built, so they arrive as a single
        // value rather than as the two discrete values a Header built directly would hold.
        expect(setCookie.getValues()).toStrictEqual(['sid=abc, theme=dark']);
    });

    it('exposes each value of a multi-value header and joins them for the header line', () => {
        const request = new ServerRequest(
            new Uri(),
            RequestMethod.GET,
            new Stream(),
            new HeaderCollection(
                new Header('Accept', 'text/html', 'application/xhtml+xml'),
                new Header('X-Trace', 'first'),
            ),
        );

        const accept = request.getHeaders().get('accept');

        expect(accept.getName()).toBe('Accept');
        expect(accept.getNormalizedName()).toBe('accept');
        expect(accept.getValues()).toStrictEqual(['text/html', 'application/xhtml+xml']);
        expect(accept.getHeaderLine()).toBe('text/html, application/xhtml+xml');
        expect(accept.getValues()).toHaveLength(2);

        const added = request.withHeaders(
            request.getHeaders().withAddedHeaders(new Header('ACCEPT', 'application/json')),
        );

        expect(added.getHeaders().getHeaderLine('accept')).toBe('text/html, application/xhtml+xml, application/json');

        const overridden = request.withHeaders(request.getHeaders().withHeader(new Header('ACCEPT', 'text/plain')));

        expect(overridden.getHeaders().getHeaderLine('Accept')).toBe('text/plain');
        expect(overridden.getHeaders().getHeaderLine('x-trace')).toBe('first');
    });

    it('splits a comma-delimited raw header line into discrete values', () => {
        const header = Header.fromValue('X-Multi: a,b,c');

        expect(header.getName()).toBe('X-Multi');
        expect(header.getNormalizedName()).toBe('x-multi');
        expect(header.getHeaderLine()).toBe('a, b, c');
        expect(header.toString()).toBe('X-Multi: a, b, c');
    });

    it('parses cookies out of the cookie header', () => {
        const request = RequestFactory.fromNodeRequest(
            NodeRequestFixture.make({ headers: { cookie: 'sid=abc123; theme=dark' } }),
        );

        const cookies = request.getCookieParams();

        expect(cookies.getAll()).toStrictEqual({ sid: 'abc123', theme: 'dark' });
        expect(cookies.get('sid')).toBe('abc123');
        expect(cookies.get('theme')).toBe('dark');
        expect(request.getHeaders().getHeaderLine('Cookie')).toBe('sid=abc123; theme=dark');
    });

    it('leaves the cookie collection empty when no cookie header is present', () => {
        const request = RequestFactory.fromNodeRequest(NodeRequestFixture.make());

        expect(request.getCookieParams().getAll()).toStrictEqual({});
    });

    it('maps query params from the url, collecting a repeated key into an array', () => {
        const request = RequestFactory.fromNodeRequest(
            NodeRequestFixture.make({ url: '/search?page=2&sort=name&tag=a&tag=b&tag=c' }),
        );

        const query = request.getQueryParams();

        expect(query.has('page')).toBe(true);
        expect(query.get('page')).toBe('2');
        expect(query.get('sort')).toBe('name');
        expect(query.get('tag')).toStrictEqual(['a', 'b', 'c']);

        // A missing query param reads back as undefined.
        expect(query.has('missing')).toBe(false);
        expect(query.get('missing')).toBeUndefined();
    });

    it('exposes the raw request method and http version as server params', () => {
        const request = RequestFactory.fromNodeRequest(
            NodeRequestFixture.make({ method: RequestMethod.PUT, httpVersion: '1.1' }),
        );

        const serverParams = request.getServerParams();

        expect(serverParams.get('method')).toBe(RequestMethod.PUT);
        expect(serverParams.get('httpVersion')).toBe('1.1');
    });

    it('maps a parsed body onto the parsed-body collection verbatim', () => {
        const request = new ServerRequest(
            new Uri(),
            RequestMethod.POST,
            new Stream(),
            new HeaderCollection(),
            ProtocolVersion.V1_1,
            new ServerParamCollection(),
            new CookieParamCollection(),
            new QueryParamCollection(),
            new ParsedBodyParamCollection({ title: 'hello', count: '3', tags: ['a', 'b'] }),
        );

        const parsedBody = request.getParsedBody();

        expect(parsedBody.has('title')).toBe(true);
        expect(parsedBody.get('title')).toBe('hello');
        expect(parsedBody.get('count')).toBe('3');
        expect(parsedBody.get('tags')).toStrictEqual(['a', 'b']);

        // A missing parsed-body param reads back as undefined.
        expect(parsedBody.has('missing')).toBe(false);
        expect(parsedBody.get('missing')).toBeUndefined();
    });

    it('re-derives the host header when the uri is swapped', () => {
        const request = new ServerRequest(
            new Uri(Scheme.EMPTY, '', '', 'original.test'),
            RequestMethod.GET,
            new Stream(),
            new HeaderCollection(new Header(HeaderName.HOST, 'original.test')),
        );

        // A host without a port yields a bare host header.
        const swapped = request.withUri(new Uri(Scheme.EMPTY, '', '', 'new.test'));

        expect(swapped.getHeaders().getHeaderLine(HeaderName.HOST)).toBe('new.test');

        // A host with a port yields host:port.
        const withPort = request.withUri(new Uri(Scheme.EMPTY, '', '', 'new.test', 9090));

        expect(withPort.getHeaders().getHeaderLine(HeaderName.HOST)).toBe('new.test:9090');

        // preserveHost keeps the existing header even though the uri changed.
        const preserved = request.withUri(new Uri(Scheme.EMPTY, '', '', 'new.test'), true);

        expect(preserved.getHeaders().getHeaderLine(HeaderName.HOST)).toBe('original.test');
        expect(preserved.getUri().getHost()).toBe('new.test');

        // A uri with no host leaves the existing header alone.
        const hostless = request.withUri(new Uri());

        expect(hostless.getHeaders().getHeaderLine(HeaderName.HOST)).toBe('original.test');
        expect(hostless.getUri().getHost()).toBe('');

        // preserveHost with no header to preserve still derives one from the uri.
        const noHeader = new ServerRequest().withUri(new Uri(Scheme.EMPTY, '', '', 'new.test', 8080), true);

        expect(noHeader.getHeaders().getHeaderLine(HeaderName.HOST)).toBe('new.test:8080');

        // The original is untouched throughout.
        expect(request.getHeaders().getHeaderLine(HeaderName.HOST)).toBe('original.test');
    });

    it('exposes the body stream verbatim and rewinds it for repeat reads', () => {
        const body = new Stream();
        body.write('{"title":"hello"}');
        body.rewind();

        const request = new ServerRequest(new Uri(), RequestMethod.GET, body);

        expect(request.getBody().getContents()).toBe('{"title":"hello"}');
        expect(request.getBody().toString()).toBe('{"title":"hello"}');

        const replacement = new Stream();
        replacement.write('replaced');
        replacement.rewind();

        const updated = request.withBody(replacement);

        expect(updated.getBody().toString()).toBe('replaced');
        expect(request.getBody().toString()).toBe('{"title":"hello"}');
    });

    it('yields the documented defaults when nothing is supplied', () => {
        const request = new ServerRequest();

        expect(request.getMethod()).toBe(RequestMethod.GET);
        expect(request.getProtocolVersion()).toBe(ProtocolVersion.V1_1);
        expect(request.getRequestTarget()).toBe('/');
        expect(request.getUri().getHost()).toBe('');
        expect(request.getHeaders().getAll()).toStrictEqual({});
        expect(request.getQueryParams().getAll()).toStrictEqual({});
        expect(request.getParsedBody().getAll()).toStrictEqual({});
        expect(request.getCookieParams().getAll()).toStrictEqual({});
        expect(request.getUploadedFiles().getAll()).toStrictEqual({});
        expect(request.getAttributes().getAll()).toStrictEqual({});
    });

    it('yields empty collections when the raw request carries nothing', () => {
        const request = RequestFactory.fromNodeRequest(NodeRequestFixture.make());

        expect(request.getMethod()).toBe(RequestMethod.GET);
        expect(request.getProtocolVersion()).toBe(ProtocolVersion.V1_1);
        expect(request.getRequestTarget()).toBe('/');
        expect(request.getQueryParams().getAll()).toStrictEqual({});
        expect(request.getParsedBody().getAll()).toStrictEqual({});
        expect(request.getUploadedFiles().getAll()).toStrictEqual({});
        expect(request.getAttributes().getAll()).toStrictEqual({});
        expect(request.getBody().toString()).toBe('');
    });

    it('drives the xhr flag from the x-requested-with header', () => {
        const xhr = RequestFactory.fromNodeRequest(
            NodeRequestFixture.make({ headers: { 'x-requested-with': 'XMLHttpRequest' } }),
        );
        const plain = RequestFactory.fromNodeRequest(NodeRequestFixture.make());

        expect(xhr.isXmlHttpRequest()).toBe(true);
        expect(plain.isXmlHttpRequest()).toBe(false);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { StatusCode } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { HeaderCollection } from '../../../../../../src/Valkyrja/Http/Message/Header/Collection/HeaderCollection.ts';
import { Header } from '../../../../../../src/Valkyrja/Http/Message/Header/Header.ts';
import { RedirectResponse } from '../../../../../../src/Valkyrja/Http/Message/Response/RedirectResponse.ts';
import { HttpRequestInvalidRedirectStatusCodeException } from '../../../../../../src/Valkyrja/Http/Message/Response/Throwable/Exception/HttpRequestInvalidRedirectStatusCodeException.ts';
import { Scheme } from '../../../../../../src/Valkyrja/Http/Message/Uri/Enum/Scheme.ts';
import { Uri } from '../../../../../../src/Valkyrja/Http/Message/Uri/Uri.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';

function requestWith(host: string, referer = ''): ServerRequestContract {
    return {
        getUri: () => new Uri(Scheme.HTTPS, '', '', host, 0, '/'),
        getHeaders: () => new HeaderCollection(...(referer ? [new Header('Referer', referer)] : [])),
    } as unknown as ServerRequestContract;
}

describe('RedirectResponse', () => {
    it('defaults to a 302 redirect with a location header', () => {
        const response = new RedirectResponse(new Uri(Scheme.HTTPS, '', '', 'example.com', 0, '/home'));

        expect(response.getStatusCode()).toBe(StatusCode.FOUND);
        expect(response.getHeaders().getHeaderLine('Location')).toContain('/home');
    });

    it('rejects a non-redirect status code', () => {
        expect(() => new RedirectResponse(undefined, StatusCode.OK)).toThrow(
            HttpRequestInvalidRedirectStatusCodeException,
        );
    });

    it('exposes and replaces the uri immutably', () => {
        const response = new RedirectResponse();
        const uri = new Uri(Scheme.HTTPS, '', '', 'example.com', 0, '/next');

        expect(response.withUri(uri).getUri()).toBe(uri);
        expect(response.createFromUri(uri).getStatusCode()).toBe(StatusCode.FOUND);
    });

    it('builds a secure redirect from a request host', () => {
        const response = new RedirectResponse().secure('/dashboard', requestWith('example.com'));

        expect(response.getUri().getScheme()).toBe(Scheme.HTTPS);
        expect(response.getUri().getHost()).toBe('example.com');
    });

    it('redirects back to the root when there is no referer', () => {
        const response = new RedirectResponse().back(requestWith('example.com'));

        expect(response.getUri().getPath()).toBe('/');
        expect(response.getUri().getHost()).toBe('');
    });

    it('redirects back to the root when the referer is an external host', () => {
        const response = new RedirectResponse().back(requestWith('example.com', 'http://other.com/elsewhere'));

        expect(response.getUri().getHost()).toBe('');
    });

    it('redirects back to an internal referer when the host matches', () => {
        const response = new RedirectResponse().back(requestWith('example.com', 'http://example.com/dashboard'));

        expect(response.getUri().getHost()).toBe('example.com');
        expect(response.getUri().getPath()).toBe('/dashboard');
    });

    it('applies defaults when creating from a uri with no arguments', () => {
        expect(RedirectResponse.createFromUri().getStatusCode()).toBe(StatusCode.FOUND);
        expect(new RedirectResponse().createFromUri().getStatusCode()).toBe(StatusCode.FOUND);
    });

    it('falls back to the root path when the uri stringifies to empty', () => {
        const response = new RedirectResponse().withUri(new Uri(Scheme.EMPTY, '', '', '', 0, ''));

        expect(response.getHeaders().has('Location')).toBe(true);
    });
});

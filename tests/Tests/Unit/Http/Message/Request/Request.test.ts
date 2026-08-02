/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { Request } from '../../../../../../src/Valkyrja/Http/Message/Request/Request.ts';
import { HttpRequestInvalidRequestTargetException } from '../../../../../../src/Valkyrja/Http/Message/Request/Throwable/Exception/HttpRequestInvalidRequestTargetException.ts';
import { Scheme } from '../../../../../../src/Valkyrja/Http/Message/Uri/Enum/Scheme.ts';
import { Uri } from '../../../../../../src/Valkyrja/Http/Message/Uri/Uri.ts';

describe('Request', () => {
    it('defaults to a GET request and adds a host header from the uri', () => {
        const request = new Request(new Uri(Scheme.HTTP, '', '', 'example.com', 8080, '/path'));

        expect(request.getMethod()).toBe(RequestMethod.GET);
        expect(request.getHeaders().getHeaderLine(HeaderName.HOST)).toContain('example.com:8080');
    });

    it('derives the request target from the uri path and query', () => {
        expect(new Request(new Uri(Scheme.HTTP, '', '', 'h', 0, '/a', 'b=1')).getRequestTarget()).toBe('/a?b=1');
        expect(new Request().getRequestTarget()).toBe('/');
    });

    it('manages an explicit request target, rejecting whitespace', () => {
        const request = new Request();

        expect(request.withRequestTarget('/custom').getRequestTarget()).toBe('/custom');
        expect(() => request.withRequestTarget('has space')).toThrow(HttpRequestInvalidRequestTargetException);
    });

    it('manages the method immutably', () => {
        expect(new Request().withMethod(RequestMethod.POST).getMethod()).toBe(RequestMethod.POST);
    });

    it('replaces the uri and updates the host header', () => {
        const request = new Request();
        const uri = new Uri(Scheme.HTTP, '', '', 'other.com');

        const withUri = request.withUri(uri);
        expect(withUri.getUri()).toBe(uri);
        expect(withUri.getHeaders().getHeaderLine(HeaderName.HOST)).toContain('other.com');
    });

    it('does not change the host header for a hostless uri or when preserving the host', () => {
        const base = new Request(new Uri(Scheme.HTTP, '', '', 'example.com'));

        expect(base.withUri(new Uri()).getUri().getHost()).toBe('');
        expect(
            base
                .withUri(new Uri(Scheme.HTTP, '', '', 'new.com'), true)
                .getHeaders()
                .getHeaderLine(HeaderName.HOST),
        ).toContain('example.com');
    });
});

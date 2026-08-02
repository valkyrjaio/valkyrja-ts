/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { AttributeParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/AttributeParamCollection.ts';
import { CookieParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/CookieParamCollection.ts';
import { ParsedBodyParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/ParsedBodyParamCollection.ts';
import { QueryParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/QueryParamCollection.ts';
import { ServerParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/ServerParamCollection.ts';
import { ServerRequest } from '../../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { UploadedFileCollection } from '../../../../../../src/Valkyrja/Http/Message/File/Collection/UploadedFileCollection.ts';

describe('ServerRequest', () => {
    it('exposes empty parameter collections by default', () => {
        const request = new ServerRequest();

        expect(request.getServerParams().getAll()).toStrictEqual({});
        expect(request.getCookieParams().getAll()).toStrictEqual({});
        expect(request.getQueryParams().getAll()).toStrictEqual({});
        expect(request.getParsedBody().getAll()).toStrictEqual({});
        expect(request.getUploadedFiles().getAll()).toStrictEqual({});
        expect(request.getAttributes().getAll()).toStrictEqual({});
    });

    it('replaces each parameter collection immutably', () => {
        const request = new ServerRequest();

        expect(
            request
                .withServerParams(new ServerParamCollection({ a: '1' }))
                .getServerParams()
                .get('a'),
        ).toBe('1');
        expect(
            request
                .withCookieParams(new CookieParamCollection({ c: '1' }))
                .getCookieParams()
                .get('c'),
        ).toBe('1');
        expect(
            request
                .withQueryParams(new QueryParamCollection({ q: '1' }))
                .getQueryParams()
                .get('q'),
        ).toBe('1');
        expect(
            request
                .withParsedBody(new ParsedBodyParamCollection({ b: '1' }))
                .getParsedBody()
                .get('b'),
        ).toBe('1');
        expect(
            request
                .withAttributes(new AttributeParamCollection({ x: '1' }))
                .getAttributes()
                .get('x'),
        ).toBe('1');
        expect(request.withUploadedFiles(new UploadedFileCollection()).getUploadedFiles().getAll()).toStrictEqual({});
    });

    it('reports whether it is an XHR request', () => {
        expect(new ServerRequest().isXmlHttpRequest()).toBe(false);
    });
});

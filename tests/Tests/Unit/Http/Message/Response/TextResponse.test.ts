/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { TextResponse } from '../../../../../../src/Valkyrja/Http/Message/Response/TextResponse.ts';

describe('TextResponse', () => {
    it('sets a plain text content type and writes the body', () => {
        const response = new TextResponse('hello');

        expect(response.getBody().getContents()).toBe('hello');
        expect(response.getHeaders().getHeaderLine(HeaderName.CONTENT_TYPE)).toContain('text/plain');
    });

    it('creates an instance via the static create', () => {
        const response = TextResponse.create('hi', StatusCode.CREATED);

        expect(response.getBody().getContents()).toBe('hi');
        expect(response.getStatusCode()).toBe(StatusCode.CREATED);
    });

    it('applies defaults when created with no arguments', () => {
        const response = TextResponse.create();

        expect(response.getBody().getContents()).toBe('');
        expect(response.getStatusCode()).toBe(StatusCode.OK);
    });
});

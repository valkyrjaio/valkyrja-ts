/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { StatusCode } from '../../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { HttpRedirectResponseException } from '../../../../../../../src/Valkyrja/Http/Message/Throwable/Exception/HttpRedirectResponseException.ts';
import { Scheme } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Enum/Scheme.ts';
import { Uri } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Uri.ts';

describe('HttpRedirectResponseException', () => {
    it('defaults to a 302 redirect to root', () => {
        const exception = new HttpRedirectResponseException();

        expect(exception.getStatusCode()).toBe(StatusCode.FOUND);
        expect(exception.getUri().getPath()).toBe('/');
        expect(exception.getResponse()).not.toBeNull();
    });

    it('uses the provided uri', () => {
        const uri = new Uri(Scheme.HTTPS, '', '', 'example.com', 0, '/next');
        const exception = new HttpRedirectResponseException(uri);

        expect(exception.getUri()).toBe(uri);
    });
});

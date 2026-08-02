/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

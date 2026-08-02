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
import { HttpNotFoundResponseException } from '../../../../../../../src/Valkyrja/Http/Message/Throwable/Exception/HttpNotFoundResponseException.ts';

describe('HttpNotFoundResponseException', () => {
    it('defaults to a 404 status code', () => {
        expect(new HttpNotFoundResponseException().getStatusCode()).toBe(StatusCode.NOT_FOUND);
    });
});

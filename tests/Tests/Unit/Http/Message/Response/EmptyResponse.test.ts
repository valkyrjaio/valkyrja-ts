/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { StatusCode } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { EmptyResponse } from '../../../../../../src/Valkyrja/Http/Message/Response/EmptyResponse.ts';

describe('EmptyResponse', () => {
    it('is a 204 No Content response with an empty body', () => {
        const response = new EmptyResponse();

        expect(response.getStatusCode()).toBe(StatusCode.NO_CONTENT);
        expect(response.getBody().getContents()).toBe('');
    });
});

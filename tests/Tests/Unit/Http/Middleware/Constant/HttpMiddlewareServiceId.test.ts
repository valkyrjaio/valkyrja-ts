/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HttpMiddlewareServiceId } from '../../../../../../src/Valkyrja/Http/Middleware/Constant/HttpMiddlewareServiceId.ts';

describe('HttpMiddlewareServiceId', () => {
    it('exposes the middleware handler service ids', () => {
        expect(HttpMiddlewareServiceId.RequestReceivedHandlerContract).toBe(
            'Valkyrja.Http.Middleware.Handler.RequestReceivedHandlerContract',
        );
        expect(HttpMiddlewareServiceId.ResponseSentHandlerContract).toBe(
            'Valkyrja.Http.Middleware.Handler.ResponseSentHandlerContract',
        );
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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

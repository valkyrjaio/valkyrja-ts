/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { Response } from '../../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { LogThrowableCaughtMiddleware } from '../../../../../../../src/Valkyrja/Http/Server/Middleware/ThrowableCaught/LogThrowableCaughtMiddleware.ts';

import type { ServerRequestContract } from '../../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../../../../../src/Valkyrja/Http/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { LoggerContract } from '../../../../../../../src/Valkyrja/Log/Logger/Contract/LoggerContract.ts';

const request = { getUri: () => ({ getPath: () => '/users' }) } as unknown as ServerRequestContract;
const handler = {
    throwableCaught: (_request: ServerRequestContract, response: ResponseContract): ResponseContract => response,
} as unknown as ThrowableCaughtHandlerContract;

describe('LogThrowableCaughtMiddleware', () => {
    it('logs the throwable and continues the chain', () => {
        const logger = { throwable: vi.fn() } as unknown as LoggerContract;
        const response = new Response();

        const result = new LogThrowableCaughtMiddleware(logger).throwableCaught(
            request,
            response,
            new Error('boom'),
            handler,
        );

        expect(logger.throwable).toHaveBeenCalledTimes(1);
        expect(result).toBe(response);
    });
});

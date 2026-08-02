/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { Input } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { LogThrowableCaughtMiddleware } from '../../../../../../../src/Valkyrja/Cli/Server/Middleware/ThrowableCaught/LogThrowableCaughtMiddleware.ts';

import type { InputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { LoggerContract } from '../../../../../../../src/Valkyrja/Log/Logger/Contract/LoggerContract.ts';

const handler = {
    throwableCaught: (_input: InputContract, output: OutputContract): OutputContract => output,
} as unknown as ThrowableCaughtHandlerContract;

describe('LogThrowableCaughtMiddleware', () => {
    it('logs Errors and non-Errors then continues the chain', () => {
        const logger = { throwable: vi.fn() } as unknown as LoggerContract;
        const middleware = new LogThrowableCaughtMiddleware(logger);

        middleware.throwableCaught(new Input('cli', 'build'), new Output(), new Error('boom'), handler);
        middleware.throwableCaught(new Input('cli', 'build'), new Output(), 'oops', handler);

        expect(logger.throwable).toHaveBeenCalledTimes(2);
    });
});

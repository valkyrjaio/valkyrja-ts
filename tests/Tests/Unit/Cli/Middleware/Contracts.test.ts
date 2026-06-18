/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ExitedMiddlewareContract } from '../../../../../src/Valkyrja/Cli/Middleware/Contract/ExitedMiddlewareContract.ts';
import { InputReceivedMiddlewareContract } from '../../../../../src/Valkyrja/Cli/Middleware/Contract/InputReceivedMiddlewareContract.ts';
import { RouteDispatchedMiddlewareContract } from '../../../../../src/Valkyrja/Cli/Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import { RouteMatchedMiddlewareContract } from '../../../../../src/Valkyrja/Cli/Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import { RouteNotMatchedMiddlewareContract } from '../../../../../src/Valkyrja/Cli/Middleware/Contract/RouteNotMatchedMiddlewareContract.ts';
import { ThrowableCaughtMiddlewareContract } from '../../../../../src/Valkyrja/Cli/Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import { ExitedHandlerContract } from '../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ExitedHandlerContract.ts';
import { HandlerContract } from '../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/HandlerContract.ts';
import { InputReceivedHandlerContract } from '../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';
import { RouteDispatchedHandlerContract } from '../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';
import { RouteMatchedHandlerContract } from '../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';
import { RouteNotMatchedHandlerContract } from '../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';
import { ThrowableCaughtHandlerContract } from '../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';

const noop = (): void => {};

describe('Cli Middleware contracts', () => {
    it.each([
        ['ExitedMiddlewareContract', ExitedMiddlewareContract, { exited: noop }],
        ['InputReceivedMiddlewareContract', InputReceivedMiddlewareContract, { inputReceived: noop }],
        ['RouteDispatchedMiddlewareContract', RouteDispatchedMiddlewareContract, { routeDispatched: noop }],
        ['RouteMatchedMiddlewareContract', RouteMatchedMiddlewareContract, { routeMatched: noop }],
        ['RouteNotMatchedMiddlewareContract', RouteNotMatchedMiddlewareContract, { routeNotMatched: noop }],
        ['ThrowableCaughtMiddlewareContract', ThrowableCaughtMiddlewareContract, { throwableCaught: noop }],
        ['ExitedHandlerContract', ExitedHandlerContract, { exited: noop }],
        ['HandlerContract', HandlerContract, { add: noop }],
        ['InputReceivedHandlerContract', InputReceivedHandlerContract, { inputReceived: noop }],
        ['RouteDispatchedHandlerContract', RouteDispatchedHandlerContract, { routeDispatched: noop }],
        ['RouteMatchedHandlerContract', RouteMatchedHandlerContract, { routeMatched: noop }],
        ['RouteNotMatchedHandlerContract', RouteNotMatchedHandlerContract, { routeNotMatched: noop }],
        ['ThrowableCaughtHandlerContract', ThrowableCaughtHandlerContract, { throwableCaught: noop }],
    ])('%s.instanceOf distinguishes matching objects', (_name, contract, matching) => {
        expect(contract.instanceOf(matching)).toBe(true);
        expect(contract.instanceOf(null)).toBe(false);
        expect(contract.instanceOf({})).toBe(false);
    });
});

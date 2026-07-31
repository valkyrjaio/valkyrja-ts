/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CallReceivedMiddlewareContract } from '../../../../../../src/Valkyrja/Grpc/Middleware/Contract/CallReceivedMiddlewareContract.ts';
import { ResponseSentMiddlewareContract } from '../../../../../../src/Valkyrja/Grpc/Middleware/Contract/ResponseSentMiddlewareContract.ts';
import { RouteDispatchedMiddlewareContract } from '../../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import { RouteMatchedMiddlewareContract } from '../../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import { RouteNotMatchedMiddlewareContract } from '../../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteNotMatchedMiddlewareContract.ts';
import { SendingResponseMiddlewareContract } from '../../../../../../src/Valkyrja/Grpc/Middleware/Contract/SendingResponseMiddlewareContract.ts';
import { ThrowableCaughtMiddlewareContract } from '../../../../../../src/Valkyrja/Grpc/Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import { PassThroughCallReceivedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/PassThroughCallReceivedMiddlewareFixture.ts';
import { PassThroughRouteMatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/PassThroughRouteMatchedMiddlewareFixture.ts';
import { RecordingResponseSentMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RecordingResponseSentMiddlewareFixture.ts';
import { RespondingRouteDispatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingRouteDispatchedMiddlewareFixture.ts';
import { RespondingRouteNotMatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingRouteNotMatchedMiddlewareFixture.ts';
import { RespondingSendingResponseMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingSendingResponseMiddlewareFixture.ts';
import { RespondingThrowableCaughtMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingThrowableCaughtMiddlewareFixture.ts';

// The stage a middleware belongs to is discovered structurally, so these guards are what the cache
// generator and any runtime collector classify with. Each must accept its own stage and reject the
// others, or a middleware silently lands in the wrong bucket — or in none.
describe.each([
    ['CallReceived', CallReceivedMiddlewareContract, new PassThroughCallReceivedMiddlewareFixture()],
    ['RouteMatched', RouteMatchedMiddlewareContract, new PassThroughRouteMatchedMiddlewareFixture()],
    ['RouteNotMatched', RouteNotMatchedMiddlewareContract, new RespondingRouteNotMatchedMiddlewareFixture()],
    ['RouteDispatched', RouteDispatchedMiddlewareContract, new RespondingRouteDispatchedMiddlewareFixture()],
    ['ThrowableCaught', ThrowableCaughtMiddlewareContract, new RespondingThrowableCaughtMiddlewareFixture()],
    ['SendingResponse', SendingResponseMiddlewareContract, new RespondingSendingResponseMiddlewareFixture()],
    ['ResponseSent', ResponseSentMiddlewareContract, new RecordingResponseSentMiddlewareFixture()],
])('%s middleware contract', (_stage, contract, middleware) => {
    it('recognizes an implementation of its own stage', () => {
        expect(contract.instanceOf(middleware)).toBe(true);
    });

    it.each([[null], [undefined], ['a string'], [42], [{}]])('rejects the non-implementation %j', (value) => {
        expect(contract.instanceOf(value)).toBe(false);
    });
});

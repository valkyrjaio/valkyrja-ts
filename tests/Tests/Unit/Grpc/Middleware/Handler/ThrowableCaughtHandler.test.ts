/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { CancellationToken } from '../../../../../../src/Valkyrja/Grpc/Message/Cancellation/CancellationToken.ts';
import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/ThrowableCaughtHandler.ts';
import { RespondingThrowableCaughtMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingThrowableCaughtMiddlewareFixture.ts';
import { ServiceCallFixture } from '../../../../Fixtures/Grpc/Message/ServiceCallFixture.ts';
import { ContainerFixture } from '../../../../Fixtures/Grpc/ContainerFixture.ts';

describe('ThrowableCaughtHandler', () => {
    it('passes the response through when there is no middleware', async () => {
        const response = ServiceResponse.ok();
        const handler = new ThrowableCaughtHandler(new Container());

        expect(await handler.throwableCaught(ServiceCallFixture.make(), response, new Error('boom'))).toBe(response);
    });

    it('delegates to the next middleware', async () => {
        const container = ContainerFixture.withMiddleware(RespondingThrowableCaughtMiddlewareFixture);
        const handler = new ThrowableCaughtHandler(container, RespondingThrowableCaughtMiddlewareFixture);

        expect(await handler.throwableCaught(ServiceCallFixture.make(), ServiceResponse.ok(), new Error('boom'))).toBe(
            RespondingThrowableCaughtMiddlewareFixture.response,
        );
    });

    it('fast-exits before the chain when the call is already cancelled', async () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.CLIENT_CANCELLED);

        const container = ContainerFixture.withMiddleware(RespondingThrowableCaughtMiddlewareFixture);
        const handler = new ThrowableCaughtHandler(container, RespondingThrowableCaughtMiddlewareFixture);
        const returned = await handler.throwableCaught(
            ServiceCallFixture.make(cancellation),
            ServiceResponse.ok(),
            new Error('boom'),
        );

        expect(returned.getStatus().getCode()).toBe(StatusCode.CANCELLED);
    });

    it('fast-exits after the chain when the middleware returns a cancelled response', async () => {
        const container = new Container();

        container.setSingleton(RespondingThrowableCaughtMiddlewareFixture.name, {
            throwableCaught: () => Promise.resolve(ServiceResponse.cancelled(CancellationReason.DEADLINE_EXCEEDED)),
        });

        const handler = new ThrowableCaughtHandler(container, RespondingThrowableCaughtMiddlewareFixture);
        const returned = await handler.throwableCaught(
            ServiceCallFixture.make(),
            ServiceResponse.ok(),
            new Error('boom'),
        );

        expect(returned.getStatus().getCode()).toBe(StatusCode.DEADLINE_EXCEEDED);
    });
});

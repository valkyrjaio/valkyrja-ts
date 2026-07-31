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
import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { SendingResponseHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/SendingResponseHandler.ts';
import { RespondingSendingResponseMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingSendingResponseMiddlewareFixture.ts';
import { ContainerFixture } from '../../../../Fixtures/Grpc/ContainerFixture.ts';
import { ServiceCallFixture } from '../../../../Fixtures/Grpc/Message/ServiceCallFixture.ts';

describe('SendingResponseHandler', () => {
    it('passes the response through when there is no middleware', async () => {
        const response = ServiceResponse.ok();

        expect(
            await new SendingResponseHandler(new Container()).sendingResponse(ServiceCallFixture.make(), response),
        ).toBe(response);
    });

    it('delegates to the next middleware', async () => {
        const container = ContainerFixture.withMiddleware(RespondingSendingResponseMiddlewareFixture);
        const handler = new SendingResponseHandler(container, RespondingSendingResponseMiddlewareFixture);

        expect(await handler.sendingResponse(ServiceCallFixture.make(), ServiceResponse.ok())).toBe(
            RespondingSendingResponseMiddlewareFixture.response,
        );
    });

    it('still runs for a cancelled call, because this stage always runs', async () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.CLIENT_CANCELLED);

        const container = ContainerFixture.withMiddleware(RespondingSendingResponseMiddlewareFixture);
        const handler = new SendingResponseHandler(container, RespondingSendingResponseMiddlewareFixture);

        expect(await handler.sendingResponse(ServiceCallFixture.make(cancellation), ServiceResponse.ok())).toBe(
            RespondingSendingResponseMiddlewareFixture.response,
        );
    });
});

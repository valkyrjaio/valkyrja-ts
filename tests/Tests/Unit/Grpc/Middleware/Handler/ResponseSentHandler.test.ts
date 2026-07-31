/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { CancellationToken } from '../../../../../../src/Valkyrja/Grpc/Message/Cancellation/CancellationToken.ts';
import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { ResponseSentHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/ResponseSentHandler.ts';
import { RecordingResponseSentMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RecordingResponseSentMiddlewareFixture.ts';
import { ContainerFixture } from '../../../../Fixtures/Grpc/ContainerFixture.ts';
import { ServiceCallFixture } from '../../../../Fixtures/Grpc/Message/ServiceCallFixture.ts';

describe('ResponseSentHandler', () => {
    beforeEach(() => {
        RecordingResponseSentMiddlewareFixture.sent.length = 0;
    });

    it('does nothing when there is no middleware', async () => {
        await new ResponseSentHandler(new Container()).responseSent(ServiceCallFixture.make(), ServiceResponse.ok());

        expect(RecordingResponseSentMiddlewareFixture.sent).toEqual([]);
    });

    it('delegates to the next middleware', async () => {
        const container = ContainerFixture.withMiddleware(RecordingResponseSentMiddlewareFixture);
        const handler = new ResponseSentHandler(container, RecordingResponseSentMiddlewareFixture);

        await handler.responseSent(ServiceCallFixture.make(), ServiceResponse.ok());

        expect(RecordingResponseSentMiddlewareFixture.sent).toEqual(['/pkg.Service/Method']);
    });

    it('still runs for a cancelled call, because this stage always runs', async () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.CLIENT_CANCELLED);

        const container = ContainerFixture.withMiddleware(RecordingResponseSentMiddlewareFixture);
        const handler = new ResponseSentHandler(container, RecordingResponseSentMiddlewareFixture);

        await handler.responseSent(ServiceCallFixture.make(cancellation), ServiceResponse.ok());

        expect(RecordingResponseSentMiddlewareFixture.sent).toEqual(['/pkg.Service/Method']);
    });
});

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { Metadata } from '../../../../../../src/Valkyrja/Grpc/Message/Metadata/Metadata.ts';
import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '../../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';

describe('ServiceResponse', () => {
    it('defaults to empty metadata and no messages', () => {
        const response = new ServiceResponse(Status.ok());

        expect(response.getStatus().getCode()).toBe(StatusCode.OK);
        expect([...response.getInitialMetadata()]).toEqual([]);
        expect([...response.getTrailingMetadata()]).toEqual([]);
        expect([...response.getMessages()]).toEqual([]);
    });

    it('copies with a new status, metadata and messages', () => {
        const response = new ServiceResponse(Status.ok());
        const initial = new Metadata().with('x-initial', 'a');
        const trailing = new Metadata().with('x-trailing', 'b');

        expect(response.withStatus(Status.aborted()).getStatus().getCode()).toBe(StatusCode.ABORTED);
        expect(response.withInitialMetadata(initial).getInitialMetadata()).toBe(initial);
        expect(response.withTrailingMetadata(trailing).getTrailingMetadata()).toBe(trailing);
        expect([...response.withMessages(['one']).getMessages()]).toEqual(['one']);
    });

    it('preserves every other field on a copy', () => {
        const initial = new Metadata().with('x-initial', 'a');
        const trailing = new Metadata().with('x-trailing', 'b');
        const response = new ServiceResponse(Status.ok(), initial, trailing, ['one']);
        const copy = response.withStatus(Status.aborted());

        expect(copy.getInitialMetadata()).toBe(initial);
        expect(copy.getTrailingMetadata()).toBe(trailing);
        expect([...copy.getMessages()]).toEqual(['one']);
    });

    it('reports a cancellation status', () => {
        expect(new ServiceResponse(Status.cancelled()).isCancellation()).toBe(true);
        expect(new ServiceResponse(Status.ok()).isCancellation()).toBe(false);
    });

    it('builds from a status with of()', () => {
        expect(ServiceResponse.of(Status.notFound()).getStatus().getCode()).toBe(StatusCode.NOT_FOUND);
    });

    it('builds an ok response with and without a message', () => {
        expect([...ServiceResponse.ok().getMessages()]).toEqual([]);
        expect([...ServiceResponse.ok('payload').getMessages()]).toEqual(['payload']);
        expect(ServiceResponse.ok('payload').getStatus().getCode()).toBe(StatusCode.OK);
    });

    it('builds an unimplemented response with and without a message', () => {
        expect(ServiceResponse.unimplemented().getStatus().getCode()).toBe(StatusCode.UNIMPLEMENTED);
        expect(ServiceResponse.unimplemented().getStatus().getMessage()).toBe('Unimplemented');
        expect(ServiceResponse.unimplemented('nope').getStatus().getMessage()).toBe('nope');
    });

    it('maps a cancellation reason onto the matching status', () => {
        expect(ServiceResponse.cancelled(CancellationReason.DEADLINE_EXCEEDED).getStatus().getCode()).toBe(
            StatusCode.DEADLINE_EXCEEDED,
        );
        expect(ServiceResponse.cancelled(CancellationReason.CLIENT_CANCELLED).getStatus().getCode()).toBe(
            StatusCode.CANCELLED,
        );
        expect(ServiceResponse.cancelled().getStatus().getCode()).toBe(StatusCode.CANCELLED);
    });

    it('exposes the reason-to-status mapping on its own', () => {
        expect(ServiceResponse.statusForReason(CancellationReason.DEADLINE_EXCEEDED).getCode()).toBe(
            StatusCode.DEADLINE_EXCEEDED,
        );
        expect(ServiceResponse.statusForReason(null).getCode()).toBe(StatusCode.CANCELLED);
    });
});

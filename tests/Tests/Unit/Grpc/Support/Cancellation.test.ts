/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CancellationToken } from '../../../../../src/Valkyrja/Grpc/Message/Cancellation/CancellationToken.ts';
import { Deadline } from '../../../../../src/Valkyrja/Grpc/Message/Deadline/Deadline.ts';
import { CancellationReason } from '../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { StatusCode } from '../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { Metadata } from '../../../../../src/Valkyrja/Grpc/Message/Metadata/Metadata.ts';
import { Peer } from '../../../../../src/Valkyrja/Grpc/Message/Peer/Peer.ts';
import { ServiceCall } from '../../../../../src/Valkyrja/Grpc/Message/Call/ServiceCall.ts';
import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';
import { Cancellation } from '../../../../../src/Valkyrja/Grpc/Support/Cancellation.ts';

const callWith = (cancellation: CancellationToken): ServiceCall =>
    new ServiceCall('/pkg.Service/Method', [], new Metadata(), Deadline.none(), cancellation, Peer.insecure('unknown'));

describe('Cancellation', () => {
    it('continues normally when nothing is cancelled', () => {
        expect(Cancellation.checkAndFinalize(callWith(new CancellationToken()))).toBeNull();
        expect(Cancellation.checkAndFinalize(callWith(new CancellationToken()), ServiceResponse.ok())).toBeNull();
    });

    it('builds a fresh cancellation response when none exists yet', () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.DEADLINE_EXCEEDED);

        const finalized = Cancellation.checkAndFinalize(callWith(cancellation));

        expect(finalized?.getStatus().getCode()).toBe(StatusCode.DEADLINE_EXCEEDED);
    });

    it('overlays the cancellation status on an existing response, preserving its metadata', () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.CLIENT_CANCELLED);

        const response = ServiceResponse.ok().withInitialMetadata(new Metadata().with('x-trace', 'a'));
        const finalized = Cancellation.checkAndFinalize(callWith(cancellation), response);

        expect(finalized?.getStatus().getCode()).toBe(StatusCode.CANCELLED);
        expect(finalized?.getInitialMetadata().get('x-trace')).toBe('a');
    });

    it('passes an already-cancelled response through unchanged', () => {
        const response = ServiceResponse.of(Status.deadlineExceeded('ran out'));
        const finalized = Cancellation.checkAndFinalize(callWith(new CancellationToken()), response);

        expect(finalized).toBe(response);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CancellationToken } from '../../../../../src/Valkyrja/Grpc/Message/Cancellation/CancellationToken.ts';
import { Deadline } from '../../../../../src/Valkyrja/Grpc/Message/Deadline/Deadline.ts';
import { Metadata } from '../../../../../src/Valkyrja/Grpc/Message/Metadata/Metadata.ts';
import { Peer } from '../../../../../src/Valkyrja/Grpc/Message/Peer/Peer.ts';
import { ServiceCall } from '../../../../../src/Valkyrja/Grpc/Message/Call/ServiceCall.ts';

import type { InboundMessages } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';

/** Builds service calls for tests, with an explicit cancellation token so cancellation is drivable. */
export class ServiceCallFixture {
    static make(
        cancellation: CancellationToken = new CancellationToken(),
        method: string = '/pkg.Service/Method',
        messages: InboundMessages = [],
    ): ServiceCall {
        return new ServiceCall(
            method,
            messages,
            new Metadata(),
            Deadline.none(),
            cancellation,
            Peer.insecure('unknown'),
        );
    }
}

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MetadataContract } from '../../Metadata/Contract/MetadataContract.ts';
import type { StatusContract } from '../../Status/Contract/StatusContract.ts';

/**
 * The immutable outbound side of the wire: what the handler and pipeline produce and the adapter
 * flushes to the client.
 *
 * Messages are typed agnostically as `unknown`: unary responses use a single-element iterable,
 * streaming responses use a lazy iterable. The underlying concrete message type is per-application
 * (the generated protobuf type) and never referenced by the framework.
 *
 * Initial metadata locks the moment the first message is written to the wire; trailing metadata
 * stays mutable until the handler returns and the adapter flushes the call's close.
 */
export interface ServiceResponseContract {
    /** Get the call outcome. */
    getStatus(): StatusContract;

    /** Return a copy with the given status. */
    withStatus(status: StatusContract): ServiceResponseContract;

    /** Get the initial response metadata (leading HTTP/2 headers). */
    getInitialMetadata(): MetadataContract;

    /** Return a copy with the given initial metadata. */
    withInitialMetadata(metadata: MetadataContract): ServiceResponseContract;

    /** Get the trailing response metadata (HTTP/2 trailing headers). */
    getTrailingMetadata(): MetadataContract;

    /** Return a copy with the given trailing metadata. */
    withTrailingMetadata(metadata: MetadataContract): ServiceResponseContract;

    /** Get the outbound messages. */
    getMessages(): Iterable<unknown>;

    /** Return a copy with the given outbound messages. */
    withMessages(messages: Iterable<unknown>): ServiceResponseContract;

    /** Whether the status is a cancellation outcome. */
    isCancellation(): boolean;
}

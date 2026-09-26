/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MetadataContract } from '../../Metadata/Contract/MetadataContract.ts';
import type { StatusContract } from '../../Status/Contract/StatusContract.ts';

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

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MetadataContract } from '../../Metadata/Contract/MetadataContract.ts';
import type { ServiceResponseContract } from '../../Response/Contract/ServiceResponseContract.ts';

export interface OutboundStreamContract {
    /**
     * Commit the initial response headers. Called exactly once, at stream open (the first emit, or
     * the close if the handler emitted nothing).
     */
    sendHeaders(initialMetadata: MetadataContract): void;

    /** Push one outbound message to the wire. */
    sendMessage(message: unknown): void;

    /**
     * Close the call with the terminal response's status and trailing metadata. The terminal
     * response's message list is unused — messages went through {@link
     * OutboundStreamContract.sendMessage}.
     */
    close(terminal: ServiceResponseContract): void;
}

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MetadataContract } from '../../../../../src/Valkyrja/Grpc/Message/Metadata/Contract/MetadataContract.ts';
import type { ServiceResponseContract } from '../../../../../src/Valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { OutboundStreamContract } from '../../../../../src/Valkyrja/Grpc/Message/Stream/Contract/OutboundStreamContract.ts';

/**
 * Records everything written to the wire, in the order it was written, so a test can assert both
 * the contents and the ordering of a streaming call's output.
 */
export class OutboundStreamFixture implements OutboundStreamContract {
    readonly headers: MetadataContract[] = [];
    readonly messages: unknown[] = [];
    readonly closed: ServiceResponseContract[] = [];

    /** Every write in order, as `headers`, `message:<value>`, `close` — the wire sequence. */
    readonly sequence: string[] = [];

    sendHeaders(initialMetadata: MetadataContract): void {
        this.headers.push(initialMetadata);
        this.sequence.push('headers');
    }

    sendMessage(message: unknown): void {
        this.messages.push(message);
        this.sequence.push(`message:${String(message)}`);
    }

    close(terminal: ServiceResponseContract): void {
        this.closed.push(terminal);
        this.sequence.push('close');
    }
}

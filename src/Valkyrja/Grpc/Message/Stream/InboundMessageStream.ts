/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class InboundMessageStream implements AsyncIterable<unknown> {
    protected readonly messages: unknown[] = [];
    protected readonly onConsumed: () => void;
    protected completed = false;
    protected pending: ((result: IteratorResult<unknown>) => void) | null = null;

    /**
     * @param onConsumed run once each time the handler consumes a message — the adapter wires this
     *     to request one more message from the transport, keeping the buffer at its high-water mark.
     */
    constructor(onConsumed: () => void = () => {}) {
        this.onConsumed = onConsumed;
    }

    /** Feed one decoded message into the stream. Called by the transport as messages arrive. */
    offer(message: unknown): void {
        this.messages.push(message);

        this.flush();
    }

    /**
     * Signal that no more messages will arrive — the client half-closed, or the call was cancelled.
     * A suspended iteration resumes and ends.
     */
    complete(): void {
        this.completed = true;

        this.flush();
    }

    [Symbol.asyncIterator](): AsyncIterator<unknown> {
        return {
            next: (): Promise<IteratorResult<unknown>> => this.next(),
        };
    }

    protected next(): Promise<IteratorResult<unknown>> {
        if (this.messages.length > 0) {
            return Promise.resolve(this.take());
        }

        if (this.completed) {
            return Promise.resolve({ value: undefined, done: true });
        }

        return new Promise((resolve) => {
            this.pending = resolve;
        });
    }

    /**
     * Resume a suspended iteration, if any, now that a message arrived or the stream completed.
     *
     * Only `offer` and `complete` call this, and each guarantees one of the two outcomes below —
     * `offer` has just buffered a message, `complete` has just set the completion flag — so there
     * is no third "nothing to hand over" case to guard against.
     */
    protected flush(): void {
        const resolve = this.pending;

        if (resolve === null) {
            return;
        }

        this.pending = null;

        resolve(this.messages.length > 0 ? this.take() : { value: undefined, done: true });
    }

    protected take(): IteratorResult<unknown> {
        const message = this.messages.shift();

        this.onConsumed();

        return { value: message, done: false };
    }
}

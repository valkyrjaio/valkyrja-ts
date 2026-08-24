/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { InboundMessageStream } from '../../../../../../src/Valkyrja/Grpc/Message/Stream/InboundMessageStream.ts';

const drain = async (stream: InboundMessageStream): Promise<unknown[]> => {
    const drained: unknown[] = [];

    for await (const message of stream) {
        drained.push(message);
    }

    return drained;
};

describe('InboundMessageStream', () => {
    it('yields messages already buffered before iteration starts', async () => {
        const stream = new InboundMessageStream();

        stream.offer('one');
        stream.offer('two');
        stream.complete();

        expect(await drain(stream)).toEqual(['one', 'two']);
    });

    it('ends immediately when completed with nothing buffered', async () => {
        const stream = new InboundMessageStream();

        stream.complete();

        expect(await drain(stream)).toEqual([]);
    });

    it('suspends iteration until a message arrives', async () => {
        const stream = new InboundMessageStream();
        const drained = drain(stream);

        await Promise.resolve();

        stream.offer('late');
        stream.complete();

        expect(await drained).toEqual(['late']);
    });

    it('resumes a suspended iteration on completion alone', async () => {
        const stream = new InboundMessageStream();
        const drained = drain(stream);

        await Promise.resolve();

        stream.complete();

        expect(await drained).toEqual([]);
    });

    it('requests one more message from the transport per message consumed', async () => {
        let consumed = 0;
        const stream = new InboundMessageStream(() => {
            consumed += 1;
        });

        stream.offer('one');
        stream.offer('two');
        stream.complete();

        await drain(stream);

        expect(consumed).toBe(2);
    });

    it('counts a message consumed from a suspended iteration too', async () => {
        let consumed = 0;
        const stream = new InboundMessageStream(() => {
            consumed += 1;
        });
        const drained = drain(stream);

        await Promise.resolve();

        stream.offer('late');
        stream.complete();

        await drained;

        expect(consumed).toBe(1);
    });

    it('ignores an offer while nothing is iterating and yields it later', async () => {
        const stream = new InboundMessageStream();

        stream.offer('one');

        const drained = drain(stream);

        await Promise.resolve();

        stream.complete();

        expect(await drained).toEqual(['one']);
    });
});

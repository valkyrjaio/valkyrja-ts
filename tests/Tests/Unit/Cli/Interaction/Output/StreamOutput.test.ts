/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { PassThrough } from 'node:stream';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { SuccessMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/SuccessMessage.ts';
import { StreamOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/StreamOutput.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(() => stdoutSpy.mockClear());

describe('StreamOutput', () => {
    it('exposes and clones its stream', () => {
        const stream = new PassThrough();
        const output = new StreamOutput(stream);

        expect(output.getStream()).toBe(stream);

        const other = new PassThrough();
        expect(output.withStream(other).getStream()).toBe(other);
    });

    it('writes the formatted text to the stream and not to stdout', () => {
        const stream = new PassThrough();

        new StreamOutput(stream).writeMessage(new SuccessMessage('hello'));

        expect((stream.read() as Buffer).toString()).toBe('\u001b[97;42mhello\u001b[39;49m');
        expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('appends each message to the stream', () => {
        const stream = new PassThrough();
        const output = new StreamOutput(stream);

        output.writeMessage(new Message('first'));
        output.writeMessage(new Message('second'));

        expect((stream.read() as Buffer).toString()).toBe('firstsecond');
    });
});

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PassThrough } from 'node:stream';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { EmptyOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/EmptyOutput.ts';
import { FileOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/FileOutput.ts';
import { PlainOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/PlainOutput.ts';
import { StreamOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/StreamOutput.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(() => {
    stdoutSpy.mockClear();
});

describe('Output subclasses', () => {
    it('EmptyOutput writes nothing to stdout', () => {
        new EmptyOutput().writeMessage(new Message('hello'));

        expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('PlainOutput writes the raw text with markup stripped', () => {
        new PlainOutput().writeMessage(new Message('<b>hello</b> world'));

        expect(stdoutSpy).toHaveBeenCalledWith('hello world');
    });

    it('StreamOutput exposes and clones its stream and does not write to stdout', () => {
        const stream = new PassThrough();
        const output = new StreamOutput(stream);

        expect(output.getStream()).toBe(stream);

        const other = new PassThrough();
        expect(output.withStream(other).getStream()).toBe(other);

        output.writeMessage(new Message('hello'));
        expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('FileOutput exposes and clones its filepath and does not write to stdout', () => {
        const output = new FileOutput('/tmp/out.log');

        expect(output.getFilepath()).toBe('/tmp/out.log');
        expect(output.withFilepath('/tmp/other.log').getFilepath()).toBe('/tmp/other.log');

        output.writeMessage(new Message('hello'));
        expect(stdoutSpy).not.toHaveBeenCalled();
    });
});

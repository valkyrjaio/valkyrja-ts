/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PassThrough } from 'node:stream';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { StreamOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/StreamOutput.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(() => stdoutSpy.mockClear());

describe('StreamOutput', () => {
    it('exposes and clones its stream and does not write to stdout', () => {
        const stream = new PassThrough();
        const output = new StreamOutput(stream);

        expect(output.getStream()).toBe(stream);

        const other = new PassThrough();
        expect(output.withStream(other).getStream()).toBe(other);

        output.writeMessage(new Message('hello'));
        expect(stdoutSpy).not.toHaveBeenCalled();
    });
});

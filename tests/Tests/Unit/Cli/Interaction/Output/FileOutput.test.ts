/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { FileOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/FileOutput.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(() => stdoutSpy.mockClear());

describe('FileOutput', () => {
    it('exposes and clones its filepath and does not write to stdout', () => {
        const output = new FileOutput('/tmp/out.log');

        expect(output.getFilepath()).toBe('/tmp/out.log');
        expect(output.withFilepath('/tmp/other.log').getFilepath()).toBe('/tmp/other.log');

        output.writeMessage(new Message('hello'));
        expect(stdoutSpy).not.toHaveBeenCalled();
    });
});

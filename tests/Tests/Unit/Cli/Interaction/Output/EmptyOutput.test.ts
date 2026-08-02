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
import { EmptyOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/EmptyOutput.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(() => stdoutSpy.mockClear());

describe('EmptyOutput', () => {
    it('writes nothing to stdout', () => {
        new EmptyOutput().writeMessage(new Message('hello'));

        expect(stdoutSpy).not.toHaveBeenCalled();
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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

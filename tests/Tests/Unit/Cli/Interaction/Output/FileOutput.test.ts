/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { FileOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/FileOutput.ts';
import { CliInteractionUnwritableFileException } from '../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionUnwritableFileException.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
const directory = mkdtempSync(join(tmpdir(), 'valkyrja-file-output-'));

afterEach(() => stdoutSpy.mockClear());
afterAll(() => {
    rmSync(directory, { recursive: true, force: true });
});

describe('FileOutput', () => {
    it('exposes and clones its filepath', () => {
        const output = new FileOutput('/tmp/out.log');

        expect(output.getFilepath()).toBe('/tmp/out.log');
        expect(output.withFilepath('/tmp/other.log').getFilepath()).toBe('/tmp/other.log');
    });

    it('writes the formatted text to the file and not to stdout', () => {
        const filepath = join(directory, 'write.log');
        const message = new Message('hello');

        new FileOutput(filepath).writeMessage(message);

        expect(readFileSync(filepath, 'utf8')).toBe(message.getFormattedText());
        expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('appends each message to the file', () => {
        const filepath = join(directory, 'append.log');
        const first = new Message('first');
        const second = new Message('second');
        const output = new FileOutput(filepath);

        output.writeMessage(first);
        output.writeMessage(second);

        expect(readFileSync(filepath, 'utf8')).toBe(first.getFormattedText() + second.getFormattedText());
    });

    it('throws when the filepath cannot be written to', () => {
        const filepath = join(directory, 'missing', 'out.log');
        const output = new FileOutput(filepath);

        expect(() => output.writeMessage(new Message('hello'))).toThrow(CliInteractionUnwritableFileException);
    });
});

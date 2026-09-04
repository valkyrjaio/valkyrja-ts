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
import { SuccessMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/SuccessMessage.ts';
import { FileOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/FileOutput.ts';
import { CliInteractionFileWriteException } from '../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionFileWriteException.ts';

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

        new FileOutput(filepath).writeMessage(new SuccessMessage('hello'));

        expect(readFileSync(filepath, 'utf8')).toBe('\u001b[97;42mhello\u001b[39;49m');
        expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('appends each message to the file', () => {
        const filepath = join(directory, 'append.log');
        const output = new FileOutput(filepath);

        output.writeMessage(new Message('first'));
        output.writeMessage(new Message('second'));

        expect(readFileSync(filepath, 'utf8')).toBe('firstsecond');
    });

    it('throws when the filepath cannot be written to', () => {
        const filepath = join(directory, 'missing', 'out.log');
        const output = new FileOutput(filepath);

        expect(() => output.writeMessage(new Message('hello'))).toThrow(CliInteractionFileWriteException);
    });

    it('gives a copy made by withFilepath its own written list', () => {
        const filepath = join(directory, 'out.log');
        const output = new FileOutput(filepath);

        output.withFilepath(join(directory, 'other.log')).writeMessage(new Message('hello'));

        // The copy wrote, and this output holds no record of that write.
        expect(output.hasWrittenMessage()).toBe(false);
    });

    it('records no written message when the write fails', () => {
        const filepath = join(directory, 'missing', 'out.log');
        const output = new FileOutput(filepath);

        expect(() => output.writeMessage(new Message('hello'))).toThrow(CliInteractionFileWriteException);
        // writeMessage records the message after the write returns, so a failed write records none.
        expect(output.hasWrittenMessage()).toBe(false);
    });
});

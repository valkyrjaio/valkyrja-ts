/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Exiter } from '../../../../../../src/Valkyrja/Cli/Server/Support/Exiter.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);

// The suite itself ends with process.exitCode, so each test restores the code it found.
let originalExitCode: typeof process.exitCode;

beforeEach(() => {
    originalExitCode = process.exitCode;
});

afterEach(() => {
    process.exitCode = originalExitCode;
    Exiter.unfreeze();
    stdoutSpy.mockClear();
    exitSpy.mockClear();
});

describe('Exiter', () => {
    it('calls process.exit by default', () => {
        Exiter.exit(0);

        expect(exitSpy).toHaveBeenCalledWith(0);
    });

    it('writes the code instead of exiting when frozen', () => {
        Exiter.freeze();

        Exiter.exit(2);

        expect(exitSpy).not.toHaveBeenCalled();
        expect(stdoutSpy).toHaveBeenCalledWith('2');
    });

    it('resumes exiting after unfreeze', () => {
        Exiter.freeze();
        Exiter.unfreeze();

        Exiter.exit(1);

        expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('sets the process exit code without ending the process', () => {
        Exiter.exitCode(3);

        expect(process.exitCode).toBe(3);
        expect(exitSpy).not.toHaveBeenCalled();
    });

    it('writes the code instead of setting the exit code when frozen', () => {
        Exiter.freeze();

        Exiter.exitCode(4);

        expect(process.exitCode).toBe(originalExitCode);
        expect(stdoutSpy).toHaveBeenCalledWith('4');
    });

    it('frozenCallback writes the code directly', () => {
        Exiter.frozenCallback(7);

        expect(stdoutSpy).toHaveBeenCalledWith('7');
    });
});

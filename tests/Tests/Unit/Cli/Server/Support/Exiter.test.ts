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

// The suite itself exits with process.exitCode, so each test restores what it found.
let originalExitCode: typeof process.exitCode;

beforeEach(() => {
    originalExitCode = process.exitCode;
});

afterEach(() => {
    process.exitCode = originalExitCode;
    Exiter.unfreeze();
    stdoutSpy.mockClear();
});

describe('Exiter', () => {
    it('sets the process exit code by default', () => {
        Exiter.exit(0);

        expect(process.exitCode).toBe(0);
    });

    it('writes the code instead of setting the exit code when frozen', () => {
        Exiter.freeze();

        Exiter.exit(2);

        expect(process.exitCode).toBe(originalExitCode);
        expect(stdoutSpy).toHaveBeenCalledWith('2');
    });

    it('resumes setting the exit code after unfreeze', () => {
        Exiter.freeze();
        Exiter.unfreeze();

        Exiter.exit(1);

        expect(process.exitCode).toBe(1);
    });

    it('frozenCallback writes the code directly', () => {
        Exiter.frozenCallback(7);

        expect(stdoutSpy).toHaveBeenCalledWith('7');
    });
});

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Exiter } from '../../../../../../src/Valkyrja/Cli/Server/Support/Exiter.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);

afterEach(() => {
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

    it('frozenCallback writes the code directly', () => {
        Exiter.frozenCallback(7);

        expect(stdoutSpy).toHaveBeenCalledWith('7');
    });
});

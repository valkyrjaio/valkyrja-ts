/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ExitCode } from '../../Interaction/Enum/ExitCode.ts';
import { InputHandler } from './InputHandler.ts';
import { Exiter } from '../Support/Exiter.ts';

export class SyncInputHandler extends InputHandler {
    /**
     * Signal the code the process ends with.
     *
     * This ends the process at once, which drops every write the operating system has not taken
     * yet. `process.stdout` is asynchronous to a pipe on macOS, so this truncates the output of
     * any piped run. Use this handler only when the process must end at once.
     */
    protected override signalExitCode(code: ExitCode | number): void {
        Exiter.exit(code);
    }
}

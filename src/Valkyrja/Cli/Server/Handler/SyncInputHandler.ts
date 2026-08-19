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
     * This ends the process at once, so a stream that buffered a write loses it. Pair this handler
     * with `FileOutput`, which writes synchronously, and not with `StreamOutput`.
     */
    protected override signalExitCode(code: ExitCode | number): void {
        Exiter.exit(code);
    }
}

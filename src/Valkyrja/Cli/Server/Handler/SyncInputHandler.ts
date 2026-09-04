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
     * @inheritdoc
     */
    protected override signalExitCode(code: ExitCode | number): void {
        Exiter.exit(code);
    }
}

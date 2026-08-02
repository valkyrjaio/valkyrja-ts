/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ExitCode } from '../../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { Input } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { OutputThrowableCaughtMiddleware } from '../../../../../../../src/Valkyrja/Cli/Server/Middleware/ThrowableCaught/OutputThrowableCaughtMiddleware.ts';

import type { InputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';

const handler = {
    throwableCaught: (_input: InputContract, output: OutputContract): OutputContract => output,
} as unknown as ThrowableCaughtHandlerContract;

describe('OutputThrowableCaughtMiddleware', () => {
    it('renders an error output for an Error', () => {
        const result = new OutputThrowableCaughtMiddleware().throwableCaught(
            new Input('cli', 'build'),
            new Output(),
            new Error('boom'),
            handler,
        );

        expect(result.getExitCode()).toBe(ExitCode.ERROR);
    });

    it('renders an error output for a non-Error', () => {
        const result = new OutputThrowableCaughtMiddleware().throwableCaught(
            new Input('cli', 'build'),
            new Output(),
            'oops',
            handler,
        );

        expect(result.getExitCode()).toBe(ExitCode.ERROR);
    });
});

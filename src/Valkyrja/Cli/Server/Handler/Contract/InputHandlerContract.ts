/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.ts';

export interface InputHandlerContract {
    handle(input: InputContract): OutputContract;
    exit(input: InputContract, output: OutputContract): void;
    run(input: InputContract): void;
}

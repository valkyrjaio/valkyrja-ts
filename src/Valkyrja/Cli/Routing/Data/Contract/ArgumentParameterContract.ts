/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ArgumentContract } from '../../../Interaction/Argument/Contract/ArgumentContract.ts';
import type { ArgumentMode } from '../../Enum/ArgumentMode.ts';
import type { ArgumentValueMode } from '../../Enum/ArgumentValueMode.ts';
import type { ParameterContract } from './ParameterContract.ts';

export interface ArgumentParameterContract extends ParameterContract {
    getMode(): ArgumentMode;
    withMode(mode: ArgumentMode): this;
    getValueMode(): ArgumentValueMode;
    withValueMode(valueMode: ArgumentValueMode): this;
    getArguments(): ArgumentContract[];
    withArguments(...arguments_: ArgumentContract[]): this;
    withAddedArguments(...arguments_: ArgumentContract[]): this;
}

export namespace ArgumentParameterContract {
    export function instanceOf(value: unknown): value is ArgumentParameterContract {
        return typeof value === 'object' && value !== null && 'getMode' in value;
    }
}

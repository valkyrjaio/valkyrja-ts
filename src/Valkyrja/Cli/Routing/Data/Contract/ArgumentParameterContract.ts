/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

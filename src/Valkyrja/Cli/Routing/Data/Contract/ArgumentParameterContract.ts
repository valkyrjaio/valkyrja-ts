import type { ArgumentContract } from '../../../Interaction/Argument/Contract/ArgumentContract.js';
import type { ArgumentMode } from '../../Enum/ArgumentMode.js';
import type { ArgumentValueMode } from '../../Enum/ArgumentValueMode.js';
import type { ParameterContract } from './ParameterContract.js';

export interface ArgumentParameterContract extends ParameterContract {
    getMode(): ArgumentMode;
    withMode(mode: ArgumentMode): this;
    getValueMode(): ArgumentValueMode;
    withValueMode(valueMode: ArgumentValueMode): this;
    getArguments(): ArgumentContract[];
    withArguments(...arguments_: ArgumentContract[]): this;
    withAddedArguments(...arguments_: ArgumentContract[]): this;
}

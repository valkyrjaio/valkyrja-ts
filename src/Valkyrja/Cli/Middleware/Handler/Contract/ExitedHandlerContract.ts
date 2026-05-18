import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface ExitedHandlerContract extends HandlerContract {
    exited(input: InputContract, output: OutputContract): void;
}

export namespace ExitedHandlerContract {
    export function instanceOf(value: unknown): value is ExitedHandlerContract {
        return typeof value === 'object' && value !== null && 'exited' in value;
    }
}

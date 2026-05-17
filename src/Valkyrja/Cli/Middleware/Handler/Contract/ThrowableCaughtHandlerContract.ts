import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface ThrowableCaughtHandlerContract extends HandlerContract {
    throwableCaught(input: InputContract, output: OutputContract, throwable: unknown): OutputContract;
}

export namespace ThrowableCaughtHandlerContract {
    export function instanceOf(value: unknown): value is ThrowableCaughtHandlerContract {
        return typeof value === 'object' && value !== null && 'throwableCaught' in value;
    }
}

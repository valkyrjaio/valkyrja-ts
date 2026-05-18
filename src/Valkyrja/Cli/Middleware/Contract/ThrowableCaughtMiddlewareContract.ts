import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.js';

export interface ThrowableCaughtMiddlewareContract {
    throwableCaught(
        input: InputContract,
        output: OutputContract,
        throwable: unknown,
        handler: ThrowableCaughtHandlerContract,
    ): OutputContract;
}

export namespace ThrowableCaughtMiddlewareContract {
    export function instanceOf(value: unknown): value is ThrowableCaughtMiddlewareContract {
        return typeof value === 'object' && value !== null && 'throwableCaught' in value;
    }
}

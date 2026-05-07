import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../Contract/ThrowableCaughtMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { ThrowableCaughtHandlerContract } from './Contract/ThrowableCaughtHandlerContract.js';

export class ThrowableCaughtHandler extends Handler implements ThrowableCaughtHandlerContract {
    throwableCaught(input: InputContract, output: OutputContract, throwable: unknown): OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<ThrowableCaughtMiddlewareContract>(next).throwableCaught(input, output, throwable, this)
            : output;
    }
}
import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { InputReceivedHandlerContract } from '../Handler/Contract/InputReceivedHandlerContract.js';

export interface InputReceivedMiddlewareContract {
    inputReceived(input: InputContract, handler: InputReceivedHandlerContract): InputContract | OutputContract;
}

export namespace InputReceivedMiddlewareContract {
    export function instanceOf(value: unknown): value is InputReceivedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'inputReceived' in value;
    }
}

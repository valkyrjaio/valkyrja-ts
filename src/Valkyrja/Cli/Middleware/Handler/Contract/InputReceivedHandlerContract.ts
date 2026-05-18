import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface InputReceivedHandlerContract extends HandlerContract {
    inputReceived(input: InputContract): InputContract | OutputContract;
}

export namespace InputReceivedHandlerContract {
    export function instanceOf(value: unknown): value is InputReceivedHandlerContract {
        return typeof value === 'object' && value !== null && 'inputReceived' in value;
    }
}

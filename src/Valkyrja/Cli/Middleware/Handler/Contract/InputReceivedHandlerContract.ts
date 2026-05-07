import type { InputContract } from '../../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../../Interaction/Output/Contract/OutputContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface InputReceivedHandlerContract extends HandlerContract {
    inputReceived(input: InputContract): InputContract | OutputContract;
}
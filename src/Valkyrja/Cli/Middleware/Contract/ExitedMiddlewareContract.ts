import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { ExitedHandlerContract } from '../Handler/Contract/ExitedHandlerContract.js';

export interface ExitedMiddlewareContract {
    exited(input: InputContract, output: OutputContract, handler: ExitedHandlerContract): void;
}
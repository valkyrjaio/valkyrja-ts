import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';

export interface InputHandlerContract {
    handle(input: InputContract): OutputContract;
    exit(input: InputContract, output: OutputContract): void;
    run(input: InputContract): void;
}

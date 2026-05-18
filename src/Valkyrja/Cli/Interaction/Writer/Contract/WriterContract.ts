import type { MessageContract } from '../../Message/Contract/MessageContract.js';
import type { OutputContract } from '../../Output/Contract/OutputContract.js';

export interface WriterContract {
    shouldWriteMessage(message: MessageContract): boolean;
    write(output: OutputContract, message: MessageContract): OutputContract;
}

export namespace WriterContract {
    export function instanceOf(value: unknown): value is WriterContract {
        return typeof value === 'object' && value !== null && 'write' in value;
    }
}

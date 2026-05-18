import type { ExitCode } from '../../../Enum/ExitCode.js';
import type { MessageContract } from '../../../Message/Contract/MessageContract.js';
import type { EmptyOutputContract } from '../../Contract/EmptyOutputContract.js';
import type { FileOutputContract } from '../../Contract/FileOutputContract.js';
import type { OutputContract } from '../../Contract/OutputContract.js';
import type { PlainOutputContract } from '../../Contract/PlainOutputContract.js';
import type { StreamOutputContract } from '../../Contract/StreamOutputContract.js';

export interface OutputFactoryContract {
    createOutput(exitCode?: ExitCode | number, ...messages: MessageContract[]): OutputContract;
    createEmptyOutput(exitCode?: ExitCode | number, ...messages: MessageContract[]): EmptyOutputContract;
    createPlainOutput(exitCode?: ExitCode | number, ...messages: MessageContract[]): PlainOutputContract;
    createFileOutput(
        filepath: string,
        exitCode?: ExitCode | number,
        ...messages: MessageContract[]
    ): FileOutputContract;
    createStreamOutput(
        stream: NodeJS.WritableStream,
        exitCode?: ExitCode | number,
        ...messages: MessageContract[]
    ): StreamOutputContract;
}

export namespace OutputFactoryContract {
    export function instanceOf(value: unknown): value is OutputFactoryContract {
        return typeof value === 'object' && value !== null && 'createOutput' in value;
    }
}

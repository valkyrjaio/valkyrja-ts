import type { MessageContract } from '../Message/Contract/MessageContract.js';
import type { FileOutputContract } from './Contract/FileOutputContract.js';
import { ExitCode } from '../Enum/ExitCode.js';
import { Output } from './Output.js';

export class FileOutput extends Output implements FileOutputContract {
    constructor(
        protected filepath: string,
        interactive: boolean = true,
        quiet: boolean = false,
        silent: boolean = false,
        exitCode: ExitCode | number = ExitCode.SUCCESS,
        ...messages: MessageContract[]
    ) {
        super(interactive, quiet, silent, exitCode, ...messages);
    }

    getFilepath(): string {
        return this.filepath;
    }

    withFilepath(filepath: string): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.filepath   = filepath;
        return clone;
    }

    protected override outputMessage(_message: MessageContract): void {
        // TODO: Implement
    }
}

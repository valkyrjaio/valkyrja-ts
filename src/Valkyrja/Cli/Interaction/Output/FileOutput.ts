import type { MessageContract } from '../Message/Contract/MessageContract.js';
import type { FileOutputContract } from './Contract/FileOutputContract.js';
import { ExitCode } from '../Enum/ExitCode.js';
import { Output } from './Output.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

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
        const clone = ObjectFactory.clone(this);
        clone.filepath = filepath;
        return clone;
    }

    protected override outputMessage(_message: MessageContract): void {
        // TODO: Implement
    }
}

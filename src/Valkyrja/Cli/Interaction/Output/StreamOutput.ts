import type { MessageContract } from '../Message/Contract/MessageContract.js';
import type { StreamOutputContract } from './Contract/StreamOutputContract.js';
import { ExitCode } from '../Enum/ExitCode.js';
import { Output } from './Output.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

export class StreamOutput extends Output implements StreamOutputContract {
    constructor(
        protected stream: NodeJS.WritableStream,
        interactive: boolean = true,
        quiet: boolean = false,
        silent: boolean = false,
        exitCode: ExitCode | number = ExitCode.SUCCESS,
        ...messages: MessageContract[]
    ) {
        super(interactive, quiet, silent, exitCode, ...messages);
    }

    getStream(): NodeJS.WritableStream {
        return this.stream;
    }

    withStream(stream: NodeJS.WritableStream): this {
        const clone = ObjectFactory.clone(this);
        clone.stream = stream;
        return clone;
    }

    protected override outputMessage(_message: MessageContract): void {
        // TODO: Implement
    }
}

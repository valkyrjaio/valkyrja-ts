/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from '../Message/Contract/MessageContract.ts';
import type { StreamOutputContract } from './Contract/StreamOutputContract.ts';
import { ExitCode } from '../Enum/ExitCode.ts';
import { Output } from './Output.ts';

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
        const clone = this.cloneOutput();
        clone.stream = stream;
        return clone;
    }

    protected override outputMessage(message: MessageContract): void {
        // A Node writable reports a failed write on an 'error' event rather than to this caller,
        // so the application attaches that listener before it hands the stream over.
        this.stream.write(message.getFormattedText());
    }
}

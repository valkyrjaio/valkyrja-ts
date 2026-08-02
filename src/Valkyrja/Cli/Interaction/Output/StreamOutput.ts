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
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

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

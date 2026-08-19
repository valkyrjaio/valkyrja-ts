/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { appendFileSync } from 'node:fs';

import type { MessageContract } from '../Message/Contract/MessageContract.ts';
import type { FileOutputContract } from './Contract/FileOutputContract.ts';
import { ExitCode } from '../Enum/ExitCode.ts';
import { Output } from './Output.ts';
import { CliInteractionUnwritableFileException } from '../Throwable/Exception/CliInteractionUnwritableFileException.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

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

    protected override outputMessage(message: MessageContract): void {
        try {
            appendFileSync(this.filepath, message.getFormattedText());
        } catch (error) {
            throw new CliInteractionUnwritableFileException(`Unable to write to file ${this.filepath}`, {
                cause: error,
            });
        }
    }
}

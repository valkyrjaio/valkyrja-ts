/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from '../../Message/Contract/MessageContract.ts';
import type { EmptyOutputContract } from '../Contract/EmptyOutputContract.ts';
import type { FileOutputContract } from '../Contract/FileOutputContract.ts';
import type { OutputContract } from '../Contract/OutputContract.ts';
import type { PlainOutputContract } from '../Contract/PlainOutputContract.ts';
import type { StreamOutputContract } from '../Contract/StreamOutputContract.ts';
import type { OutputFactoryContract } from './Contract/OutputFactoryContract.ts';
import { CliInteractionConfig } from '../../Data/CliInteractionConfig.ts';
import type { CliInteractionConfigContract } from '../../Data/Contract/CliInteractionConfigContract.ts';
import { ExitCode } from '../../Enum/ExitCode.ts';
import { EmptyOutput } from '../EmptyOutput.ts';
import { FileOutput } from '../FileOutput.ts';
import { Output } from '../Output.ts';
import { PlainOutput } from '../PlainOutput.ts';
import { StreamOutput } from '../StreamOutput.ts';

export class OutputFactory implements OutputFactoryContract {
    constructor(protected config: CliInteractionConfigContract = new CliInteractionConfig()) {}

    createOutput(exitCode: ExitCode | number = ExitCode.SUCCESS, ...messages: MessageContract[]): OutputContract {
        return new Output(this.config.isInteractive, this.config.isQuiet, this.config.isSilent, exitCode, ...messages);
    }

    createEmptyOutput(
        exitCode: ExitCode | number = ExitCode.SUCCESS,
        ...messages: MessageContract[]
    ): EmptyOutputContract {
        return new EmptyOutput(
            this.config.isInteractive,
            this.config.isQuiet,
            this.config.isSilent,
            exitCode,
            ...messages,
        );
    }

    createPlainOutput(
        exitCode: ExitCode | number = ExitCode.SUCCESS,
        ...messages: MessageContract[]
    ): PlainOutputContract {
        return new PlainOutput(
            this.config.isInteractive,
            this.config.isQuiet,
            this.config.isSilent,
            exitCode,
            ...messages,
        );
    }

    createFileOutput(
        filepath: string,
        exitCode: ExitCode | number = ExitCode.SUCCESS,
        ...messages: MessageContract[]
    ): FileOutputContract {
        return new FileOutput(
            filepath,
            this.config.isInteractive,
            this.config.isQuiet,
            this.config.isSilent,
            exitCode,
            ...messages,
        );
    }

    createStreamOutput(
        stream: NodeJS.WritableStream,
        exitCode: ExitCode | number = ExitCode.SUCCESS,
        ...messages: MessageContract[]
    ): StreamOutputContract {
        return new StreamOutput(
            stream,
            this.config.isInteractive,
            this.config.isQuiet,
            this.config.isSilent,
            exitCode,
            ...messages,
        );
    }
}

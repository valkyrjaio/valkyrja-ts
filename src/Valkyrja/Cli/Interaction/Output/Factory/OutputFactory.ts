import type { MessageContract } from '../../../Message/Contract/MessageContract.js';
import type { EmptyOutputContract } from '../../Contract/EmptyOutputContract.js';
import type { FileOutputContract } from '../../Contract/FileOutputContract.js';
import type { OutputContract } from '../../Contract/OutputContract.js';
import type { PlainOutputContract } from '../../Contract/PlainOutputContract.js';
import type { StreamOutputContract } from '../../Contract/StreamOutputContract.js';
import type { OutputFactoryContract } from './Contract/OutputFactoryContract.js';
import { CliInteractionConfig } from '../../../Data/CliInteractionConfig.js';
import type { CliInteractionConfigContract } from '../../../Data/Contract/CliInteractionConfigContract.js';
import { ExitCode } from '../../../Enum/ExitCode.js';
import { EmptyOutput } from '../../EmptyOutput.js';
import { FileOutput } from '../../FileOutput.js';
import { Output } from '../../Output.js';
import { PlainOutput } from '../../PlainOutput.js';
import { StreamOutput } from '../../StreamOutput.js';

export class OutputFactory implements OutputFactoryContract {
    constructor(protected config: CliInteractionConfigContract = new CliInteractionConfig()) {}

    createOutput(exitCode: ExitCode | number = ExitCode.SUCCESS, ...messages: MessageContract[]): OutputContract {
        return new Output(this.config.isInteractive, this.config.isQuiet, this.config.isSilent, exitCode, ...messages);
    }

    createEmptyOutput(exitCode: ExitCode | number = ExitCode.SUCCESS, ...messages: MessageContract[]): EmptyOutputContract {
        return new EmptyOutput(this.config.isInteractive, this.config.isQuiet, this.config.isSilent, exitCode, ...messages);
    }

    createPlainOutput(exitCode: ExitCode | number = ExitCode.SUCCESS, ...messages: MessageContract[]): PlainOutputContract {
        return new PlainOutput(this.config.isInteractive, this.config.isQuiet, this.config.isSilent, exitCode, ...messages);
    }

    createFileOutput(filepath: string, exitCode: ExitCode | number = ExitCode.SUCCESS, ...messages: MessageContract[]): FileOutputContract {
        return new FileOutput(filepath, this.config.isInteractive, this.config.isQuiet, this.config.isSilent, exitCode, ...messages);
    }

    createStreamOutput(stream: NodeJS.WritableStream, exitCode: ExitCode | number = ExitCode.SUCCESS, ...messages: MessageContract[]): StreamOutputContract {
        return new StreamOutput(stream, this.config.isInteractive, this.config.isQuiet, this.config.isSilent, exitCode, ...messages);
    }
}
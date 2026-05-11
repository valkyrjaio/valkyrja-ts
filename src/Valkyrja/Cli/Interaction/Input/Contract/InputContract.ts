import type { ArgumentContract } from '../../Argument/Contract/ArgumentContract.js';
import type { OptionContract } from '../../Option/Contract/OptionContract.js';

export interface InputContract {
    getCaller(): string;
    withCaller(caller: string): this;
    getCommandName(): string;
    withCommandName(commandName: string): this;
    getArguments(): ArgumentContract[];
    withArguments(...arguments_: ArgumentContract[]): this;
    withAddedArgument(argument: ArgumentContract): this;
    withoutArgument(value: string): this;
    withoutArguments(): this;
    getOptions(): OptionContract[];
    getOption(name: string): OptionContract[];
    hasOption(name: string): boolean;
    withOptions(...options: OptionContract[]): this;
    withAddedOption(option: OptionContract): this;
    withoutOption(name: string): this;
    withoutOptions(): this;
}

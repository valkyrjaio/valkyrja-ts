import type { ArgumentContract } from '../Argument/Contract/ArgumentContract.js';
import type { InputContract } from './Contract/InputContract.js';
import type { OptionContract } from '../Option/Contract/OptionContract.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

export class Input implements InputContract {
    constructor(
        protected caller: string = 'valkyrja',
        protected commandName: string = 'list',
        protected arguments_: ArgumentContract[] = [],
        protected options: OptionContract[] = [],
    ) {}

    getCaller(): string {
        return this.caller;
    }

    withCaller(caller: string): this {
        const clone   = ObjectFactory.clone(this);
        clone.caller  = caller;
        return clone;
    }

    getCommandName(): string {
        return this.commandName;
    }

    withCommandName(commandName: string): this {
        const clone         = ObjectFactory.clone(this);
        clone.commandName   = commandName;
        return clone;
    }

    getArguments(): ArgumentContract[] {
        return this.arguments_;
    }

    withArguments(...arguments_: ArgumentContract[]): this {
        const clone      = ObjectFactory.clone(this);
        clone.arguments_ = arguments_;
        return clone;
    }

    withAddedArgument(argument: ArgumentContract): this {
        const clone      = ObjectFactory.clone(this);
        clone.arguments_ = [...this.arguments_, argument];
        return clone;
    }

    withoutArgument(value: string): this {
        const clone      = ObjectFactory.clone(this);
        clone.arguments_ = this.arguments_.filter((a) => a.getValue() !== value);
        return clone;
    }

    withoutArguments(): this {
        const clone      = ObjectFactory.clone(this);
        clone.arguments_ = [];
        return clone;
    }

    getOptions(): OptionContract[] {
        return this.options;
    }

    getOption(name: string): OptionContract[] {
        return this.options.filter((o) => o.getName() === name);
    }

    hasOption(name: string): boolean {
        return this.getOption(name).length > 0;
    }

    withOptions(...options: OptionContract[]): this {
        const clone   = ObjectFactory.clone(this);
        clone.options = options;
        return clone;
    }

    withAddedOption(option: OptionContract): this {
        const clone   = ObjectFactory.clone(this);
        clone.options = [...this.options, option];
        return clone;
    }

    withoutOption(name: string): this {
        const clone   = ObjectFactory.clone(this);
        clone.options = this.options.filter((o) => o.getName() !== name);
        return clone;
    }

    withoutOptions(): this {
        const clone   = ObjectFactory.clone(this);
        clone.options = [];
        return clone;
    }
}

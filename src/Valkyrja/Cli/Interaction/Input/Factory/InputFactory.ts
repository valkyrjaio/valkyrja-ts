import type { InputContract } from '../Contract/InputContract.js';
import { ArgumentFactory } from '../../Argument/Factory/ArgumentFactory.js';
import { Input } from '../Input.js';
import { OptionFactory } from '../../Option/Factory/OptionFactory.js';

export abstract class InputFactory {
    static fromGlobals(args: string[], applicationName: string, commandName: string): InputContract {
        return InputFactory.inputWithProperties(new Input(), args, applicationName, commandName);
    }

    protected static inputWithProperties(input: InputContract, args: string[], applicationName: string, commandName: string): InputContract {
        const arguments_ = [];
        const options    = [];

        for (const [key, arg] of args.entries()) {
            if (key === 0) {
                applicationName = arg;
            } else if (arg.startsWith('-')) {
                options.push(...OptionFactory.fromArg(arg));
            } else if (key === 1) {
                commandName = arg;
            } else {
                arguments_.push(ArgumentFactory.fromArg(arg));
            }
        }

        return input
            .withCaller(applicationName)
            .withCommandName(commandName)
            .withArguments(...arguments_)
            .withOptions(...options);
    }
}

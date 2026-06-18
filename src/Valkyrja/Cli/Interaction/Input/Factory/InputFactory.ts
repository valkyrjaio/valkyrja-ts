/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { InputContract } from '../Contract/InputContract.ts';
import { ArgumentFactory } from '../../Argument/Factory/ArgumentFactory.ts';
import { Input } from '../Input.ts';
import { OptionFactory } from '../../Option/Factory/OptionFactory.ts';

export abstract class InputFactory {
    static fromGlobals(args: string[], applicationName: string, commandName: string): InputContract {
        return InputFactory.inputWithProperties(new Input(), args, applicationName, commandName);
    }

    protected static inputWithProperties(
        input: InputContract,
        args: string[],
        applicationName: string,
        commandName: string,
    ): InputContract {
        const arguments_ = [];
        const options = [];

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

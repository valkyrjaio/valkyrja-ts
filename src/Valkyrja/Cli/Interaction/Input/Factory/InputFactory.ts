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
    /** The POSIX end-of-options marker. Every arg after it is an operand. */
    static readonly END_OF_OPTIONS = '--' as const;

    /** A lone dash, which names standard input by convention and is an operand, not an option. */
    static readonly STDIN = '-' as const;

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
        let endOfOptions = false;

        for (const [key, arg] of args.entries()) {
            if (key === 0) {
                applicationName = arg;
            } else if (!endOfOptions && arg === InputFactory.END_OF_OPTIONS) {
                // POSIX end-of-options marker: the `--` itself is consumed, and every arg after
                // it is an operand — never an option, however many dashes it starts with. A
                // second `--` is therefore an ordinary operand.
                endOfOptions = true;
            } else if (!endOfOptions && arg !== InputFactory.STDIN && arg.startsWith('-')) {
                // A lone `-` is an operand by convention (it names standard input), not an option.
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

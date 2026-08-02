/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ArgumentContract } from '../../Argument/Contract/ArgumentContract.ts';
import type { OptionContract } from '../../Option/Contract/OptionContract.ts';

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

export namespace InputContract {
    export function instanceOf(value: unknown): value is InputContract {
        return typeof value === 'object' && value !== null && 'getCaller' in value;
    }
}

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { OptionType } from '../../Enum/OptionType.ts';
import { Option } from '../Option.ts';
import { CliInteractionInvalidEmptyValueException } from '../../Throwable/Exception/CliInteractionInvalidEmptyValueException.ts';
import { CliInteractionInvalidNonEmptyValueException } from '../../Throwable/Exception/CliInteractionInvalidNonEmptyValueException.ts';
import { CliInteractionInvalidOptionNameException } from '../../Throwable/Exception/CliInteractionInvalidOptionNameException.ts';

export abstract class OptionFactory {
    static fromArg(arg: string): Option[] {
        OptionFactory.validateArgIsOption(arg);

        const type = OptionFactory.getOptionType(arg);
        const parts = arg.split('=');
        const name = (parts[0] ?? '').replace(/^-+/, '').trim();
        const value = parts[1] ?? '';

        OptionFactory.validateNonEmptyName(name);

        if (type === OptionType.SHORT && name.length > 1) {
            OptionFactory.validateValueIsEmpty(value);
            return OptionFactory.splitCombinedShortOptions(type, name);
        }

        return [new Option(name, value, type)];
    }

    protected static validateArgIsOption(arg: string): void {
        if (!arg.startsWith('-')) {
            throw new CliInteractionInvalidOptionNameException('Options must begin with either a `-` or `--`');
        }
    }

    protected static validateNonEmptyName(name: string): void {
        if (name === '') {
            throw new CliInteractionInvalidNonEmptyValueException('Option name cannot be empty');
        }
    }

    protected static getOptionType(arg: string): OptionType {
        return arg.startsWith('--') ? OptionType.LONG : OptionType.SHORT;
    }

    protected static validateValueIsEmpty(value: string): void {
        if (value !== '') {
            throw new CliInteractionInvalidEmptyValueException('Cannot combine multiple options and include a value');
        }
    }

    protected static splitCombinedShortOptions(type: OptionType, name: string): Option[] {
        return name.split('').map((item) => new Option(item, '', type));
    }
}

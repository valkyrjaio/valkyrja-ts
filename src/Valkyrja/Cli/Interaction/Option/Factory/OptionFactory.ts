/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
        // Split on the first `=` only, so a value that itself contains one survives intact
        // (`--expr=a=b` yields `a=b`, not `a`).
        const separatorIndex = arg.indexOf('=');
        const name = (separatorIndex === -1 ? arg : arg.slice(0, separatorIndex)).replace(/^-+/, '').trim();
        const value = separatorIndex === -1 ? '' : arg.slice(separatorIndex + 1);

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

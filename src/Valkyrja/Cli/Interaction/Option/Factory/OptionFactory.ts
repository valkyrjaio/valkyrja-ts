import { OptionType } from '../../Enum/OptionType.js';
import { Option } from '../Option.js';
import { CliInteractionInvalidEmptyValueException } from '../../Throwable/Exception/CliInteractionInvalidEmptyValueException.js';
import { CliInteractionInvalidNonEmptyValueException } from '../../Throwable/Exception/CliInteractionInvalidNonEmptyValueException.js';
import { CliInteractionInvalidOptionNameException } from '../../Throwable/Exception/CliInteractionInvalidOptionNameException.js';

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

import type { OptionContract } from '../../Interaction/Option/Contract/OptionContract.js';
import type { OptionParameterContract } from './Contract/OptionParameterContract.js';
import type { Cast } from '../../../Type/Data/Cast.js';
import { OptionMode } from '../Enum/OptionMode.js';
import { OptionValueMode } from '../Enum/OptionValueMode.js';
import { CliRoutingInvalidOptionWithValueException } from '../Throwable/Exception/CliRoutingInvalidOptionWithValueException.js';
import { CliRoutingOptionValuesValidationException } from '../Throwable/Exception/CliRoutingOptionValuesValidationException.js';
import { Parameter } from './Abstract/Parameter.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

export class OptionParameter extends Parameter implements OptionParameterContract {
    constructor(
        name: string,
        description: string,
        protected valueDisplayName: string = '',
        cast: Cast | null = null,
        protected defaultValue: string = '',
        protected shortNames: string[] = [],
        protected validValues: string[] = [],
        protected options: OptionContract[] = [],
        protected mode: OptionMode = OptionMode.OPTIONAL,
        protected valueMode: OptionValueMode = OptionValueMode.DEFAULT,
    ) {
        super(name, description, cast);
    }

    getShortNames(): string[] {
        return this.shortNames;
    }

    withShortNames(...shortNames: string[]): this {
        const clone        = ObjectFactory.clone(this);
        clone.shortNames   = shortNames;
        return clone;
    }

    withAddedShortNames(...shortNames: string[]): this {
        const clone      = ObjectFactory.clone(this);
        const existing   = new Set(clone.shortNames);
        for (const n of shortNames) {
            if (!existing.has(n)) {
                existing.add(n);
            }
        }
        clone.shortNames = [...existing];
        return clone;
    }

    getMode(): OptionMode {
        return this.mode;
    }

    withMode(mode: OptionMode): this {
        const clone  = ObjectFactory.clone(this);
        clone.mode   = mode;
        return clone;
    }

    getValueMode(): OptionValueMode {
        return this.valueMode;
    }

    withValueMode(valueMode: OptionValueMode): this {
        const clone       = ObjectFactory.clone(this);
        clone.valueMode   = valueMode;
        return clone;
    }

    hasValueDisplayName(): boolean {
        return this.valueDisplayName !== '';
    }

    getValueDisplayName(): string {
        return this.valueDisplayName;
    }

    withValueDisplayName(valueName: string): this {
        const clone              = ObjectFactory.clone(this);
        clone.valueDisplayName   = valueName;
        return clone;
    }

    getValidValues(): string[] {
        return this.validValues;
    }

    withValidValues(...validValues: string[]): this {
        const clone         = ObjectFactory.clone(this);
        clone.validValues   = validValues;
        return clone;
    }

    withAddedValidValues(...validValues: string[]): this {
        const clone     = ObjectFactory.clone(this);
        const existing  = new Set(clone.validValues);
        for (const v of validValues) {
            if (!existing.has(v)) {
                existing.add(v);
            }
        }
        clone.validValues = [...existing];
        return clone;
    }

    hasDefaultValue(): boolean {
        return this.defaultValue !== '';
    }

    getDefaultValue(): string {
        return this.defaultValue;
    }

    withDefaultValue(defaultValue: string): this {
        const clone          = ObjectFactory.clone(this);
        clone.defaultValue   = defaultValue;
        return clone;
    }

    getOptions(): OptionContract[] {
        return this.options;
    }

    withOptions(...options: OptionContract[]): this {
        const clone   = ObjectFactory.clone(this);
        clone.options = [];
        for (const option of options) {
            if (this.valueMode === OptionValueMode.NONE && option.hasValue()) {
                throw new CliRoutingInvalidOptionWithValueException(`${this.name} should have no value`);
            }
            clone.options.push(option);
        }
        return clone;
    }

    withAddedOptions(...options: OptionContract[]): this {
        const clone   = ObjectFactory.clone(this);
        clone.options = [...this.options];
        for (const option of options) {
            if (this.valueMode === OptionValueMode.NONE && option.hasValue()) {
                throw new CliRoutingInvalidOptionWithValueException(`${this.name} should have no value`);
            }
            clone.options.push(option);
        }
        return clone;
    }

    getCastValues(): unknown[] {
        return this.getCastValuesForParameters(this.options);
    }

    hasFirstValue(): boolean {
        return this.options.length > 0;
    }

    getFirstValue(): string {
        return this.options[0]?.getValue() ?? '';
    }

    areValuesValid(): boolean {
        let valid = true;

        if (this.mode === OptionMode.REQUIRED) {
            valid = this.options.length > 0;
        }

        if (this.valueMode === OptionValueMode.DEFAULT) {
            valid = valid && this.options.length <= 1;
        }

        return valid;
    }

    validateValues(): this {
        if (!this.areValuesValid()) {
            throw new CliRoutingOptionValuesValidationException(`${this.name} is invalid`);
        }
        return this;
    }
}

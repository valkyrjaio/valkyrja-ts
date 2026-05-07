import type { OptionContract } from '../../../Interaction/Option/Contract/OptionContract.js';
import type { OptionMode } from '../../Enum/OptionMode.js';
import type { OptionValueMode } from '../../Enum/OptionValueMode.js';
import type { ParameterContract } from './ParameterContract.js';

export interface OptionParameterContract extends ParameterContract {
    getShortNames(): string[];
    withShortNames(...shortNames: string[]): this;
    withAddedShortNames(...shortNames: string[]): this;
    getMode(): OptionMode;
    withMode(mode: OptionMode): this;
    getValueMode(): OptionValueMode;
    withValueMode(valueMode: OptionValueMode): this;
    hasValueDisplayName(): boolean;
    getValueDisplayName(): string;
    withValueDisplayName(valueName: string): this;
    getValidValues(): string[];
    withValidValues(...validValues: string[]): this;
    withAddedValidValues(...validValues: string[]): this;
    hasDefaultValue(): boolean;
    getDefaultValue(): string;
    withDefaultValue(defaultValue: string): this;
    getOptions(): OptionContract[];
    withOptions(...options: OptionContract[]): this;
    withAddedOptions(...options: OptionContract[]): this;
}
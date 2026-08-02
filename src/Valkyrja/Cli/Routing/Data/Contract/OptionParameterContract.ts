/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { OptionContract } from '../../../Interaction/Option/Contract/OptionContract.ts';
import type { OptionMode } from '../../Enum/OptionMode.ts';
import type { OptionValueMode } from '../../Enum/OptionValueMode.ts';
import type { ParameterContract } from './ParameterContract.ts';

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

export namespace OptionParameterContract {
    export function instanceOf(value: unknown): value is OptionParameterContract {
        return typeof value === 'object' && value !== null && 'getShortNames' in value;
    }
}

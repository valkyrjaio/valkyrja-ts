/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

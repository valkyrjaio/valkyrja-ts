/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { OptionType } from '../../Enum/OptionType.ts';

export interface OptionContract {
    getName(): string;
    withName(name: string): this;
    hasValue(): boolean;
    getValue(): string;
    withValue(value: string): this;
    withoutValue(): this;
    getType(): OptionType;
    withType(type: OptionType): this;
}

export namespace OptionContract {
    export function instanceOf(value: unknown): value is OptionContract {
        return typeof value === 'object' && value !== null && 'getName' in value;
    }
}

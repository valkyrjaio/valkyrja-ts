/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Cast } from '../../../../Type/Data/Cast.ts';

export interface ParameterContract {
    getName(): string;
    withName(name: string): this;
    hasCast(): boolean;
    getCast(): Cast;
    withCast(cast: Cast): this;
    withoutCast(): this;
    getDescription(): string;
    withDescription(description: string): this;
    getCastValues(): unknown[];
    hasFirstValue(): boolean;
    getFirstValue(): string;
    areValuesValid(): boolean;
    validateValues(): this;
}

export namespace ParameterContract {
    export function instanceOf(value: unknown): value is ParameterContract {
        return typeof value === 'object' && value !== null && 'getName' in value;
    }
}

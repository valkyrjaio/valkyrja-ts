/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Cast } from '../../../../Type/Data/Cast.js';

export interface ParameterContract {
    getName(): string;
    withName(name: string): this;
    getRegex(): string;
    withRegex(regex: string): this;
    hasCast(): boolean;
    getCast(): Cast;
    withCast(cast: Cast): this;
    isOptional(): boolean;
    withIsOptional(isOptional: boolean): this;
    shouldCapture(): boolean;
    withShouldCapture(shouldCapture: boolean): this;
    getDefault(): unknown;
    withDefault(defaultValue?: unknown): this;
    getValue(): unknown;
    withValue(value?: unknown): this;
}

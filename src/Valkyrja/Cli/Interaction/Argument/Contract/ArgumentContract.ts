/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface ArgumentContract {
    getValue(): string;
    withValue(value: string): this;
}

export namespace ArgumentContract {
    export function instanceOf(value: unknown): value is ArgumentContract {
        return typeof value === 'object' && value !== null && 'getValue' in value;
    }
}

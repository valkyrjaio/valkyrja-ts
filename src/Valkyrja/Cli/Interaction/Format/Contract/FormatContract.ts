/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface FormatContract {
    getSetCode(): string;
    withSetCode(setCode: string): this;
    getUnsetCode(): string;
    withUnsetCode(unsetCode: string): this;
}

export namespace FormatContract {
    export function instanceOf(value: unknown): value is FormatContract {
        return typeof value === 'object' && value !== null && 'getSetCode' in value;
    }
}

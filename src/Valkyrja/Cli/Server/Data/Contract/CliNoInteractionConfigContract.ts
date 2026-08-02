/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface CliNoInteractionConfigContract {
    readonly noInteractionOptionName: string;
    readonly noInteractionOptionShortName: string;
}

export namespace CliNoInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliNoInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'noInteractionOptionName' in value;
    }
}

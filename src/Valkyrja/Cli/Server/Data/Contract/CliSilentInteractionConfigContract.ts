/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface CliSilentInteractionConfigContract {
    readonly silentOptionName: string;
    readonly silentOptionShortName: string;
}

export namespace CliSilentInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliSilentInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'silentOptionName' in value;
    }
}

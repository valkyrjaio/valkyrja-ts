/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface CliHelpCommandConfigContract {
    readonly helpCommandName: string;
    readonly helpOptionName: string;
    readonly helpOptionShortName: string;
}

export namespace CliHelpCommandConfigContract {
    export function instanceOf(value: unknown): value is CliHelpCommandConfigContract {
        return typeof value === 'object' && value !== null && 'helpCommandName' in value;
    }
}

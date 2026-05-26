/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface CliVersionCommandConfigContract {
    readonly versionCommandName: string;
    readonly versionOptionName: string;
    readonly versionOptionShortName: string;
}

export namespace CliVersionCommandConfigContract {
    export function instanceOf(value: unknown): value is CliVersionCommandConfigContract {
        return typeof value === 'object' && value !== null && 'versionCommandName' in value;
    }
}

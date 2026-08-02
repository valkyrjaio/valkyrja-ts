/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface CliRoutingConfigContract {
    readonly dataClassName: string;
}

export namespace CliRoutingConfigContract {
    export function instanceOf(value: unknown): value is CliRoutingConfigContract {
        return typeof value === 'object' && value !== null && 'dataClassName' in value;
    }
}

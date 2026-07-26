/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

export interface CliRouteProviderContract {
    /**
     * The command controller classes whose routing decorators Sindri (and, on
     * the debug path, the runtime `AttributeRouteCollector`) should scan.
     */
    getControllerClasses(): Array<new (...args: unknown[]) => unknown>;
    getRoutes(): RouteContract[];
}

export namespace CliRouteProviderContract {
    export function instanceOf(value: unknown): value is CliRouteProviderContract {
        return typeof value === 'object' && value !== null && 'getRoutes' in value;
    }
}

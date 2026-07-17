/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CliRouteProviderContract } from '../../../../../src/Valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { RouteContract } from '../../../../../src/Valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';

export class CliRouteProviderFixture implements CliRouteProviderContract {
    getRoutes(): RouteContract[] {
        return [];
    }
}

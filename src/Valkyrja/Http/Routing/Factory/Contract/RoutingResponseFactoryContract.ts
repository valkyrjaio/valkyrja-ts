/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { StatusCode } from '../../../Message/Enum/StatusCode.js';
import type { HeaderCollectionContract } from '../../../Message/Header/Collection/Contract/HeaderCollectionContract.js';
import type { RedirectResponseContract } from '../../../Message/Response/Contract/RedirectResponseContract.js';

export interface RoutingResponseFactoryContract {
    createRouteRedirectResponse(
        name: string,
        data?: Record<string, string | number>,
        statusCode?: StatusCode,
        headers?: HeaderCollectionContract,
    ): RedirectResponseContract;
}

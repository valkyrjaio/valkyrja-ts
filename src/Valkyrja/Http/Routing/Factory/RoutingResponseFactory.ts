/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { StatusCode } from '../../Message/Enum/StatusCode.js';
import type { HeaderCollectionContract } from '../../Message/Header/Collection/Contract/HeaderCollectionContract.js';
import type { RedirectResponseContract } from '../../Message/Response/Contract/RedirectResponseContract.js';
import type { ResponseFactoryContract } from '../../Message/Response/Factory/Contract/ResponseFactoryContract.js';
import type { UrlContract } from '../Url/Contract/UrlContract.js';
import type { RoutingResponseFactoryContract } from './Contract/RoutingResponseFactoryContract.js';

export class RoutingResponseFactory implements RoutingResponseFactoryContract {
    constructor(
        protected responseFactory: ResponseFactoryContract,
        protected url: UrlContract,
    ) {}

    createRouteRedirectResponse(
        name: string,
        data: Record<string, string | number> = {},
        statusCode?: StatusCode,
        headers?: HeaderCollectionContract,
    ): RedirectResponseContract {
        const url = this.url.getUrl(name, data);

        return this.responseFactory.createRedirectResponse(url, statusCode, headers);
    }
}

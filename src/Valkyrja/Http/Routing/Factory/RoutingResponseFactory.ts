/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { StatusCode } from '../../Message/Enum/StatusCode.ts';
import type { HeaderCollectionContract } from '../../Message/Header/Collection/Contract/HeaderCollectionContract.ts';
import type { RedirectResponseContract } from '../../Message/Response/Contract/RedirectResponseContract.ts';
import type { ResponseFactoryContract } from '../../Message/Response/Factory/Contract/ResponseFactoryContract.ts';
import type { UrlContract } from '../Url/Contract/UrlContract.ts';
import type { RoutingResponseFactoryContract } from './Contract/RoutingResponseFactoryContract.ts';

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

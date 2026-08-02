/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { StatusCode } from '../../../Message/Enum/StatusCode.ts';
import type { HeaderCollectionContract } from '../../../Message/Header/Collection/Contract/HeaderCollectionContract.ts';
import type { RedirectResponseContract } from '../../../Message/Response/Contract/RedirectResponseContract.ts';

export interface RoutingResponseFactoryContract {
    createRouteRedirectResponse(
        name: string,
        data?: Record<string, string | number>,
        statusCode?: StatusCode,
        headers?: HeaderCollectionContract,
    ): RedirectResponseContract;
}

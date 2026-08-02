/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HeaderCollectionContract } from '../../../Header/Collection/Contract/HeaderCollectionContract.ts';
import type { JsonResponseContract } from '../../Contract/JsonResponseContract.ts';
import type { RedirectResponseContract } from '../../Contract/RedirectResponseContract.ts';
import type { ResponseContract } from '../../Contract/ResponseContract.ts';
import type { TextResponseContract } from '../../Contract/TextResponseContract.ts';
import type { StatusCode } from '../../../Enum/StatusCode.ts';

export interface ResponseFactoryContract {
    createResponse(
        content?: string | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): ResponseContract;
    createTextResponse(
        content?: string | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): TextResponseContract;
    createJsonResponse(
        data?: Record<string, unknown> | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): JsonResponseContract;
    createJsonpResponse(
        callback: string,
        data?: Record<string, unknown> | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): JsonResponseContract;
    createRedirectResponse(
        uri?: string | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): RedirectResponseContract;
}

/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

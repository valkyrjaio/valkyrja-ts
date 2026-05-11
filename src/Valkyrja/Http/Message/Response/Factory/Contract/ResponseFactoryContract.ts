import type { HeaderCollectionContract } from '../../../Header/Collection/Contract/HeaderCollectionContract.js';
import type { JsonResponseContract } from '../../Contract/JsonResponseContract.js';
import type { RedirectResponseContract } from '../../Contract/RedirectResponseContract.js';
import type { ResponseContract } from '../../Contract/ResponseContract.js';
import type { TextResponseContract } from '../../Contract/TextResponseContract.js';
import type { StatusCode } from '../../../Enum/StatusCode.js';

export interface ResponseFactoryContract {
    createResponse(
        content?: string | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null
    ): ResponseContract;
    createTextResponse(
        content?: string | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null
    ): TextResponseContract;
    createJsonResponse(
        data?: Record<string, unknown> | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null
    ): JsonResponseContract;
    createJsonpResponse(
        callback: string,
        data?: Record<string, unknown> | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null
    ): JsonResponseContract;
    createRedirectResponse(
        uri?: string | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null
    ): RedirectResponseContract;
}
import type { ResponseFactoryContract } from './Contract/ResponseFactoryContract.js';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.js';
import type { JsonResponseContract } from '../Contract/JsonResponseContract.js';
import type { RedirectResponseContract } from '../Contract/RedirectResponseContract.js';
import type { ResponseContract } from '../Contract/ResponseContract.js';
import type { TextResponseContract } from '../Contract/TextResponseContract.js';
import { Response } from '../Response.js';
import { TextResponse } from '../TextResponse.js';
import { JsonResponse } from '../JsonResponse.js';
import { RedirectResponse } from '../RedirectResponse.js';
import { UriFactory } from '../../Uri/Factory/UriFactory.js';
import { StatusCode } from '../../Enum/StatusCode.js';

export class ResponseFactory implements ResponseFactoryContract {
    createResponse(
        content: string | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null
    ): ResponseContract {
        return Response.create(content, statusCode, headers);
    }

    createTextResponse(
        content: string | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null
    ): TextResponseContract {
        return TextResponse.create(content, statusCode, headers);
    }

    createJsonResponse(
        data: Record<string, unknown> | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null
    ): JsonResponseContract {
        return JsonResponse.createFromData(data, statusCode, headers);
    }

    createJsonpResponse(
        callback: string,
        data: Record<string, unknown> | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null
    ): JsonResponseContract {
        return this.createJsonResponse(data, statusCode, headers).withCallback(callback);
    }

    createRedirectResponse(
        uri: string | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null
    ): RedirectResponseContract {
        return RedirectResponse.createFromUri(UriFactory.fromString(uri ?? '/'), statusCode, headers);
    }
}
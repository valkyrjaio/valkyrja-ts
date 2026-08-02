/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ResponseFactoryContract } from './Contract/ResponseFactoryContract.ts';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.ts';
import type { JsonResponseContract } from '../Contract/JsonResponseContract.ts';
import type { RedirectResponseContract } from '../Contract/RedirectResponseContract.ts';
import type { ResponseContract } from '../Contract/ResponseContract.ts';
import type { TextResponseContract } from '../Contract/TextResponseContract.ts';
import { Response } from '../Response.ts';
import { TextResponse } from '../TextResponse.ts';
import { JsonResponse } from '../JsonResponse.ts';
import { RedirectResponse } from '../RedirectResponse.ts';
import { UriFactory } from '../../Uri/Factory/UriFactory.ts';
import { StatusCode } from '../../Enum/StatusCode.ts';

export class ResponseFactory implements ResponseFactoryContract {
    createResponse(
        content: string | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
    ): ResponseContract {
        return Response.create(content, statusCode, headers);
    }

    createTextResponse(
        content: string | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
    ): TextResponseContract {
        return TextResponse.create(content, statusCode, headers);
    }

    createJsonResponse(
        data: Record<string, unknown> | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
    ): JsonResponseContract {
        return JsonResponse.createFromData(data, statusCode, headers);
    }

    createJsonpResponse(
        callback: string,
        data: Record<string, unknown> | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
    ): JsonResponseContract {
        return this.createJsonResponse(data, statusCode, headers).withCallback(callback);
    }

    createRedirectResponse(
        uri: string | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
    ): RedirectResponseContract {
        return RedirectResponse.createFromUri(UriFactory.fromString(uri ?? '/'), statusCode, headers);
    }
}

/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ResponseContract } from '../../Response/Contract/ResponseContract.ts';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.ts';
import { HttpMessageRuntimeException } from './Abstract/HttpMessageRuntimeException.ts';
import { HeaderCollection } from '../../Header/Collection/HeaderCollection.ts';
import { StatusCode } from '../../Enum/StatusCode.ts';

export class HttpResponseException extends HttpMessageRuntimeException {
    protected statusCode: StatusCode;
    protected headers: HeaderCollectionContract;
    protected response: ResponseContract | null;

    constructor(
        statusCode: StatusCode | null = null,
        message: string | null = null,
        headers: HeaderCollectionContract | null = null,
        response: ResponseContract | null = null,
    ) {
        super(message ?? '');
        this.statusCode = statusCode ?? response?.getStatusCode() ?? StatusCode.INTERNAL_SERVER_ERROR;
        this.headers = headers ?? new HeaderCollection();
        this.response = response?.withStatusCode(this.statusCode) ?? null;
    }

    getStatusCode(): StatusCode {
        return this.statusCode;
    }

    getHeaders(): HeaderCollectionContract {
        return this.headers;
    }

    getResponse(): ResponseContract | null {
        return this.response;
    }
}

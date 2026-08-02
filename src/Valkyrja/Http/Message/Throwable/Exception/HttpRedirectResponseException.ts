/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ResponseContract } from '../../Response/Contract/ResponseContract.ts';
import type { UriContract } from '../../Uri/Contract/UriContract.ts';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.ts';
import { HttpResponseException } from './HttpResponseException.ts';
import { HeaderCollection } from '../../Header/Collection/HeaderCollection.ts';
import { RedirectResponse } from '../../Response/RedirectResponse.ts';
import { Uri } from '../../Uri/Uri.ts';
import { Scheme } from '../../Uri/Enum/Scheme.ts';
import { StatusCode } from '../../Enum/StatusCode.ts';

export class HttpRedirectResponseException extends HttpResponseException {
    protected uri: UriContract;

    constructor(
        uri: UriContract | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
        response: ResponseContract | null = null,
    ) {
        const resolvedStatus = statusCode ?? StatusCode.FOUND;
        const resolvedHeaders = headers ?? new HeaderCollection();
        const resolvedUri = uri ?? new Uri(Scheme.EMPTY, '', '', '', 0, '/');
        const resolvedResponse =
            response ?? RedirectResponse.createFromUri(resolvedUri, resolvedStatus, resolvedHeaders);

        super(resolvedStatus, 'Redirect', resolvedHeaders, resolvedResponse);
        this.uri = resolvedUri;
    }

    getUri(): UriContract {
        return this.uri;
    }
}

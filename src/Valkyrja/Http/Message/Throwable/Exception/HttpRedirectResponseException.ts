import type { ResponseContract } from '../../Response/Contract/ResponseContract.js';
import type { UriContract } from '../../Uri/Contract/UriContract.js';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.js';
import { HttpResponseException } from './HttpResponseException.js';
import { HeaderCollection } from '../../Header/Collection/HeaderCollection.js';
import { RedirectResponse } from '../../Response/RedirectResponse.js';
import { Uri } from '../../Uri/Uri.js';
import { Scheme } from '../../Uri/Enum/Scheme.js';
import { StatusCode } from '../../Enum/StatusCode.js';

export class HttpRedirectResponseException extends HttpResponseException {
    protected uri: UriContract;

    constructor(
        uri: UriContract | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
        response: ResponseContract | null = null
    ) {
        const resolvedStatus  = statusCode ?? StatusCode.FOUND;
        const resolvedHeaders = headers ?? new HeaderCollection();
        const resolvedUri     = uri ?? new Uri(Scheme.EMPTY, '', '', '', 0, '/');
        const resolvedResponse = response ?? RedirectResponse.createFromUri(resolvedUri, resolvedStatus, resolvedHeaders);

        super(resolvedStatus, 'Redirect', resolvedHeaders, resolvedResponse);
        this.uri = resolvedUri;
    }

    getUri(): UriContract {
        return this.uri;
    }
}
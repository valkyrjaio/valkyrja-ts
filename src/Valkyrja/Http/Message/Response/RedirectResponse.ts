import type { RedirectResponseContract } from './Contract/RedirectResponseContract.js';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import type { ServerRequestContract } from '../Request/Contract/ServerRequestContract.js';
import type { UriContract } from '../Uri/Contract/UriContract.js';
import { Response } from './Response.js';
import { Message } from '../Trait/Message.js';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.js';
import { Location } from '../Header/Location.js';
import { Uri } from '../Uri/Uri.js';
import { UriFactory } from '../Uri/Factory/UriFactory.js';
import { Stream } from '../Stream/Stream.js';
import { Scheme } from '../Uri/Enum/Scheme.js';
import { StatusCode, statusCodeIsRedirect } from '../Enum/StatusCode.js';
import { HttpRequestInvalidRedirectStatusCodeException } from './Throwable/Exception/HttpRequestInvalidRedirectStatusCodeException.js';

export class RedirectResponse extends Response implements RedirectResponseContract {
    protected uri: UriContract;

    constructor(
        uri: UriContract = new Uri(Scheme.EMPTY, '', '', '', 0, '/'),
        statusCode: StatusCode = StatusCode.FOUND,
        headers: HeaderCollectionContract = new HeaderCollection(),
    ) {
        if (!statusCodeIsRedirect(statusCode)) {
            throw new HttpRequestInvalidRedirectStatusCodeException(`Invalid redirect status code ${String(statusCode)} used.`);
        }
        super(new Stream(), statusCode, Message.injectHeader(RedirectResponse.getHeaderFromUri(uri), headers, true));
        this.uri = uri;
    }

    static createFromUri(
        uri: UriContract | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
    ): RedirectResponse {
        return new this(
            uri ?? new Uri(Scheme.EMPTY, '', '', '', 0, '/'),
            statusCode ?? StatusCode.FOUND,
            headers ?? new HeaderCollection(),
        );
    }

    getUri(): UriContract {
        return this.uri;
    }

    withUri(uri: UriContract): this {
        const headers = this.headers.withHeader(RedirectResponse.getHeaderFromUri(uri));
        const clone = this.withHeaders(headers);
        clone.uri = uri;
        return clone;
    }

    secure(path: string, request: ServerRequestContract): this {
        const requestUri = request.getUri();
        const uri = new Uri(Scheme.HTTPS, '', '', requestUri.getHost(), requestUri.getPort(), path);
        return this.withUri(uri);
    }

    back(request: ServerRequestContract): this {
        const refererLine = request.getHeaders().getHeaderLine('Referer') || '/';
        const refererUri = UriFactory.fromString(refererLine);
        const resolved = this.isInternalUri(request, refererUri)
            ? refererUri
            : new Uri(Scheme.EMPTY, '', '', '', 0, '/');
        return this.withUri(resolved);
    }

    createFromUri(
        uri?: UriContract | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): this {
        return (this.constructor as typeof RedirectResponse).createFromUri(
            uri ?? null,
            statusCode ?? null,
            headers ?? null,
        ) as this;
    }

    protected isInternalUri(request: ServerRequestContract, uri: UriContract): boolean {
        const host = uri.getHost();
        return !host || host === request.getUri().getHost();
    }

    protected static getHeaderFromUri(uri: UriContract): Location {
        const uriString = uri.toString() || '/';
        return new Location(uriString);
    }
}

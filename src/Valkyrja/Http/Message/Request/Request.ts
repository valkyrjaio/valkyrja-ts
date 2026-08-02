/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RequestContract } from './Contract/RequestContract.ts';
import type { UriContract } from '../Uri/Contract/UriContract.ts';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.ts';
import type { StreamContract } from '../Stream/Contract/StreamContract.ts';
import { Message } from '../Trait/Message.ts';
import { Header } from '../Header/Header.ts';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.ts';
import { HeaderName } from '../Constant/HeaderName.ts';
import { RequestMethod } from '../Enum/RequestMethod.ts';
import { Stream } from '../Stream/Stream.ts';
import { Uri } from '../Uri/Uri.ts';
import { HttpRequestInvalidRequestTargetException } from './Throwable/Exception/HttpRequestInvalidRequestTargetException.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export class Request extends Message implements RequestContract {
    protected requestTarget: string | null = null;

    constructor(
        protected uri: UriContract = new Uri(),
        protected method: RequestMethod = RequestMethod.GET,
        body: StreamContract = new Stream(),
        protected override headers: HeaderCollectionContract = new HeaderCollection(),
    ) {
        super();
        this.setBody(body);
        this.addHostHeaderFromUri();
    }

    getRequestTarget(): string {
        if (this.requestTarget !== null) {
            return this.requestTarget;
        }

        let target = this.uri.getPath();

        if (this.uri.getQuery()) {
            target += '?' + this.uri.getQuery();
        }

        return target || '/';
    }

    withRequestTarget(requestTarget: string): this {
        this.validateRequestTarget(requestTarget);
        const clone = ObjectFactory.clone(this);
        clone.requestTarget = requestTarget;
        return clone;
    }

    getMethod(): RequestMethod {
        return this.method;
    }

    withMethod(method: RequestMethod): this {
        const clone = ObjectFactory.clone(this);
        clone.method = method;
        return clone;
    }

    getUri(): UriContract {
        return this.uri;
    }

    withUri(uri: UriContract, preserveHost: boolean = false): this {
        const clone = ObjectFactory.clone(this);
        clone.uri = uri;

        if (preserveHost && this.headers.has(HeaderName.HOST)) {
            return clone;
        }

        if (!uri.getHost()) {
            return clone;
        }

        const host = clone.getHostFromUri();
        clone.headers = this.headers.withHeader(new Header(HeaderName.HOST, host));
        return clone;
    }

    protected validateRequestTarget(requestTarget: string): void {
        if (/\s/.test(requestTarget)) {
            throw new HttpRequestInvalidRequestTargetException(
                'Invalid request target provided; cannot contain whitespace',
            );
        }
    }

    protected getHostFromUri(): string {
        const host = this.uri.getHost();
        const port = this.uri.getPort();
        return host + (port !== 0 ? `:${String(port)}` : '');
    }

    protected addHostHeaderFromUri(): void {
        if (!this.headers.has(HeaderName.HOST) && this.uri.getHost()) {
            this.headers = this.headers.withHeader(new Header(HeaderName.HOST, this.getHostFromUri()));
        }
    }
}

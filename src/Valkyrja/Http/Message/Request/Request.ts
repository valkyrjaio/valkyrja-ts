import type { RequestContract } from './Contract/RequestContract.js';
import type { UriContract } from '../Uri/Contract/UriContract.js';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import type { StreamContract } from '../Stream/Contract/StreamContract.js';
import { Message } from '../Trait/Message.js';
import { Header } from '../Header/Header.js';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.js';
import { HeaderName } from '../Constant/HeaderName.js';
import { RequestMethod } from '../Enum/RequestMethod.js';
import { Stream } from '../Stream/Stream.js';
import { Uri } from '../Uri/Uri.js';
import { HttpRequestInvalidRequestTargetException } from './Throwable/Exception/HttpRequestInvalidRequestTargetException.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

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

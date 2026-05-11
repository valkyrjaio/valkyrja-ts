import type { ResponseContract } from './Contract/ResponseContract.js';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import type { StreamContract } from '../Stream/Contract/StreamContract.js';
import type { CookieContract } from '../Header/Value/Contract/CookieContract.js';
import { Message } from '../Trait/Message.js';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.js';
import { SetCookie } from '../Header/SetCookie.js';
import { Stream } from '../Stream/Stream.js';
import { StatusCode, statusCodeAsPhrase } from '../Enum/StatusCode.js';

export class Response extends Message implements ResponseContract {
    protected statusPhrase: string;

    constructor(
        body: StreamContract = new Stream(),
        protected statusCode: StatusCode = StatusCode.OK,
        protected override headers: HeaderCollectionContract = new HeaderCollection()
    ) {
        super();
        this.statusPhrase = statusCodeAsPhrase(statusCode).toString();
        this.setBody(body);
    }

    static create(
        content: string | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null
    ): Response {
        const stream = new Stream();
        stream.write(content ?? '');
        stream.rewind();
        return new this(stream, statusCode ?? StatusCode.OK, headers ?? new HeaderCollection());
    }

    getStatusCode(): StatusCode {
        return this.statusCode;
    }

    withStatusCode(code: StatusCode): this {
        const clone          = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.statusCode     = code;
        clone.statusPhrase   = statusCodeAsPhrase(code).toString();
        return clone;
    }

    getReasonPhrase(): string {
        return this.statusPhrase;
    }

    withReasonPhrase(reasonPhrase: string): this {
        const clone        = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.statusPhrase = reasonPhrase || statusCodeAsPhrase(this.statusCode).toString();
        return clone;
    }

    withCookie(cookie: CookieContract): this {
        return this.withHeaders(this.headers.withAddedHeaders(new SetCookie(cookie)));
    }

    withoutCookie(cookie: CookieContract): this {
        return this.withHeaders(this.headers.withAddedHeaders(new SetCookie(cookie.delete())));
    }

    create(
        content?: string | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null
    ): this {
        return (this.constructor as typeof Response).create(
            content ?? null,
            statusCode ?? null,
            headers ?? null
        ) as this;
    }
}

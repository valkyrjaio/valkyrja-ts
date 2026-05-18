import type { JsonResponseContract } from './Contract/JsonResponseContract.js';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import { Response } from './Response.js';
import { Message } from '../Trait/Message.js';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.js';
import { Header } from '../Header/Header.js';
import { ContentType } from '../Header/ContentType.js';
import { HeaderName } from '../Constant/HeaderName.js';
import { ContentTypeValue } from '../Constant/ContentTypeValue.js';
import { Stream } from '../Stream/Stream.js';
import { StatusCode } from '../Enum/StatusCode.js';
import { HttpRequestInvalidJsonCallbackException } from './Throwable/Exception/HttpRequestInvalidJsonCallbackException.js';

export class JsonResponse extends Response implements JsonResponseContract {
    protected data: Record<string, unknown>;

    constructor(
        data: Record<string, unknown> = {},
        statusCode: StatusCode = StatusCode.OK,
        headers: HeaderCollectionContract = new HeaderCollection(),
    ) {
        const body = new Stream();
        body.write(JSON.stringify(data));
        body.rewind();
        super(
            body,
            statusCode,
            Message.injectHeader(new Header(HeaderName.CONTENT_TYPE, ContentTypeValue.APPLICATION_JSON), headers, true),
        );
        this.data = data;
    }

    static createFromData(
        data: Record<string, unknown> | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
    ): JsonResponse {
        return new this(data ?? {}, statusCode ?? StatusCode.OK, headers ?? new HeaderCollection());
    }

    getBodyAsJson(): Record<string, unknown> {
        return JSON.parse(this.stream.getContents()) as Record<string, unknown>;
    }

    withJsonAsBody(data: Record<string, unknown>): this {
        const body = new Stream();
        body.write(JSON.stringify(data));
        body.rewind();
        return this.withBody(body);
    }

    withCallback(callback: string): this {
        this.verifyCallback(callback);
        const clone = this.withHeaders(this.headers.withHeader(new ContentType(ContentTypeValue.TEXT_JAVASCRIPT)));
        clone.stream = new Stream();
        clone.stream.write(`/**/${callback}(${this.stream.getContents()});`);
        clone.stream.rewind();
        return clone;
    }

    withoutCallback(): this {
        const clone = this.withHeaders(this.headers.withHeader(new ContentType(ContentTypeValue.APPLICATION_JSON)));
        clone.stream = new Stream();
        clone.stream.write(JSON.stringify(clone.data));
        clone.stream.rewind();
        return clone;
    }

    createFromData(
        data?: Record<string, unknown> | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): this {
        return (this.constructor as typeof JsonResponse).createFromData(
            data ?? null,
            statusCode ?? null,
            headers ?? null,
        ) as this;
    }

    override create(
        content?: string | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): this {
        const data = content ? (JSON.parse(content) as Record<string, unknown>) : {};
        return (this.constructor as typeof JsonResponse).createFromData(
            data,
            statusCode ?? null,
            headers ?? null,
        ) as this;
    }

    protected verifyCallback(callback: string): void {
        const pattern = /^[$_\p{L}][$_\p{L}\p{Mn}\p{Mc}\p{Nd}\p{Pc}‌‍]*$/u;
        for (const part of callback.split('.')) {
            if (!pattern.test(part)) {
                throw new HttpRequestInvalidJsonCallbackException('The callback name is not valid.');
            }
        }
    }
}

import type { TextResponseContract } from './Contract/TextResponseContract.js';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import { Response } from './Response.js';
import { Message } from '../Trait/Message.js';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.js';
import { Header } from '../Header/Header.js';
import { HeaderName } from '../Constant/HeaderName.js';
import { ContentTypeValue } from '../Constant/ContentTypeValue.js';
import { Stream } from '../Stream/Stream.js';
import { StatusCode } from '../Enum/StatusCode.js';

export class TextResponse extends Response implements TextResponseContract {
    constructor(
        text: string = '',
        statusCode: StatusCode = StatusCode.OK,
        headers: HeaderCollectionContract = new HeaderCollection()
    ) {
        const body = new Stream();
        body.write(text);
        body.rewind();
        super(
            body,
            statusCode,
            Message.injectHeader(new Header(HeaderName.CONTENT_TYPE, ContentTypeValue.TEXT_PLAIN_UTF8), headers, true)
        );
    }

    static override create(
        content: string | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null
    ): TextResponse {
        return new this(content ?? '', statusCode ?? StatusCode.OK, headers ?? new HeaderCollection());
    }
}

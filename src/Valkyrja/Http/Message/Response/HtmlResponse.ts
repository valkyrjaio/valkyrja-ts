import type { HtmlResponseContract } from './Contract/HtmlResponseContract.js';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import { Response } from './Response.js';
import { Message } from '../Trait/Message.js';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.js';
import { Header } from '../Header/Header.js';
import { HeaderName } from '../Constant/HeaderName.js';
import { ContentTypeValue } from '../Constant/ContentTypeValue.js';
import { Stream } from '../Stream/Stream.js';
import { StatusCode } from '../Enum/StatusCode.js';

export class HtmlResponse extends Response implements HtmlResponseContract {
    constructor(
        html: string = '',
        statusCode: StatusCode = StatusCode.OK,
        headers: HeaderCollectionContract = new HeaderCollection()
    ) {
        const body = new Stream();
        body.write(html);
        body.rewind();
        super(
            body,
            statusCode,
            Message.injectHeader(new Header(HeaderName.CONTENT_TYPE, ContentTypeValue.TEXT_HTML_UTF8), headers, true)
        );
    }
}

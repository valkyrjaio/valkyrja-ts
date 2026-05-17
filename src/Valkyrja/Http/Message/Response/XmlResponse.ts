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

export class XmlResponse extends Response implements HtmlResponseContract {
    constructor(
        xml: string = '',
        statusCode: StatusCode = StatusCode.OK,
        headers: HeaderCollectionContract = new HeaderCollection(),
    ) {
        const body = new Stream();
        body.write(xml);
        body.rewind();
        super(
            body,
            statusCode,
            Message.injectHeader(
                new Header(HeaderName.CONTENT_TYPE, ContentTypeValue.APPLICATION_XML_UTF8),
                headers,
                true,
            ),
        );
    }
}

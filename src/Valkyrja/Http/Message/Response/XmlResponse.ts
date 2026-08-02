/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HtmlResponseContract } from './Contract/HtmlResponseContract.ts';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.ts';
import { Response } from './Response.ts';
import { Message } from '../Trait/Message.ts';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.ts';
import { Header } from '../Header/Header.ts';
import { HeaderName } from '../Constant/HeaderName.ts';
import { ContentTypeValue } from '../Constant/ContentTypeValue.ts';
import { Stream } from '../Stream/Stream.ts';
import { StatusCode } from '../Enum/StatusCode.ts';

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

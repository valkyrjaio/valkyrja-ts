/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { TextResponseContract } from './Contract/TextResponseContract.ts';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.ts';
import { Response } from './Response.ts';
import { Message } from '../Trait/Message.ts';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.ts';
import { Header } from '../Header/Header.ts';
import { HeaderName } from '../Constant/HeaderName.ts';
import { ContentTypeValue } from '../Constant/ContentTypeValue.ts';
import { Stream } from '../Stream/Stream.ts';
import { StatusCode } from '../Enum/StatusCode.ts';

export class TextResponse extends Response implements TextResponseContract {
    constructor(
        text: string = '',
        statusCode: StatusCode = StatusCode.OK,
        headers: HeaderCollectionContract = new HeaderCollection(),
    ) {
        const body = new Stream();
        body.write(text);
        body.rewind();
        super(
            body,
            statusCode,
            Message.injectHeader(new Header(HeaderName.CONTENT_TYPE, ContentTypeValue.TEXT_PLAIN_UTF8), headers, true),
        );
    }

    static override create(
        content: string | null = null,
        statusCode: StatusCode | null = null,
        headers: HeaderCollectionContract | null = null,
    ): TextResponse {
        return new this(content ?? '', statusCode ?? StatusCode.OK, headers ?? new HeaderCollection());
    }
}

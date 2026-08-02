/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { JsonServerRequestContract } from './Contract/JsonServerRequestContract.ts';
import type { UriContract } from '../Uri/Contract/UriContract.ts';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.ts';
import type { StreamContract } from '../Stream/Contract/StreamContract.ts';
import type { UploadedFileCollectionContract } from '../File/Collection/Contract/UploadedFileCollectionContract.ts';
import type { CookieParamCollectionContract } from '../Param/Contract/CookieParamCollectionContract.ts';
import type { ParsedBodyParamCollectionContract } from '../Param/Contract/ParsedBodyParamCollectionContract.ts';
import type { ParsedJsonParamCollectionContract } from '../Param/Contract/ParsedJsonParamCollectionContract.ts';
import type { QueryParamCollectionContract } from '../Param/Contract/QueryParamCollectionContract.ts';
import type { ServerParamCollectionContract } from '../Param/Contract/ServerParamCollectionContract.ts';
import { ServerRequest } from './ServerRequest.ts';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.ts';
import { CookieParamCollection } from '../Param/CookieParamCollection.ts';
import { ParsedBodyParamCollection } from '../Param/ParsedBodyParamCollection.ts';
import { ParsedJsonParamCollection } from '../Param/ParsedJsonParamCollection.ts';
import { QueryParamCollection } from '../Param/QueryParamCollection.ts';
import { ServerParamCollection } from '../Param/ServerParamCollection.ts';
import { UploadedFileCollection } from '../File/Collection/UploadedFileCollection.ts';
import { ContentTypeValue } from '../Constant/ContentTypeValue.ts';
import { HeaderName } from '../Constant/HeaderName.ts';
import { ProtocolVersion } from '../Enum/ProtocolVersion.ts';
import { RequestMethod } from '../Enum/RequestMethod.ts';
import { Stream } from '../Stream/Stream.ts';
import { Uri } from '../Uri/Uri.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export class JsonServerRequest extends ServerRequest implements JsonServerRequestContract {
    protected parsedJson: ParsedJsonParamCollectionContract;

    constructor(
        uri: UriContract = new Uri(),
        method: RequestMethod = RequestMethod.GET,
        body: StreamContract = new Stream(),
        headers: HeaderCollectionContract = new HeaderCollection(),
        protocol: ProtocolVersion = ProtocolVersion.V1_1,
        server: ServerParamCollectionContract = new ServerParamCollection(),
        cookies: CookieParamCollectionContract = new CookieParamCollection(),
        query: QueryParamCollectionContract = new QueryParamCollection(),
        parsedBody: ParsedBodyParamCollectionContract = new ParsedBodyParamCollection(),
        parsedJson: ParsedJsonParamCollectionContract = new ParsedJsonParamCollection(),
        files: UploadedFileCollectionContract = new UploadedFileCollection(),
    ) {
        super(uri, method, body, headers, protocol, server, cookies, query, parsedBody, files);
        this.parsedJson = parsedJson;

        const contentType = headers.getHeaderLine(HeaderName.CONTENT_TYPE);

        if (contentType.includes(ContentTypeValue.APPLICATION_JSON)) {
            const bodyContents = body.toString();

            if (bodyContents !== '') {
                const parsed = JSON.parse(bodyContents) as Record<string, unknown>;
                this.parsedJson = new ParsedJsonParamCollection(parsed);
            }
        }
    }

    getParsedJson(): ParsedJsonParamCollectionContract {
        return this.parsedJson;
    }

    withParsedJson(params: ParsedJsonParamCollectionContract): this {
        const clone = ObjectFactory.clone(this);
        clone.parsedJson = params;
        return clone;
    }
}

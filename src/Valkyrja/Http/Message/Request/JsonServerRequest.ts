import type { JsonServerRequestContract } from './Contract/JsonServerRequestContract.js';
import type { UriContract } from '../Uri/Contract/UriContract.js';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import type { StreamContract } from '../Stream/Contract/StreamContract.js';
import type { UploadedFileCollectionContract } from '../File/Collection/Contract/UploadedFileCollectionContract.js';
import type { CookieParamCollectionContract } from '../Param/Contract/CookieParamCollectionContract.js';
import type { ParsedBodyParamCollectionContract } from '../Param/Contract/ParsedBodyParamCollectionContract.js';
import type { ParsedJsonParamCollectionContract } from '../Param/Contract/ParsedJsonParamCollectionContract.js';
import type { QueryParamCollectionContract } from '../Param/Contract/QueryParamCollectionContract.js';
import type { ServerParamCollectionContract } from '../Param/Contract/ServerParamCollectionContract.js';
import { ServerRequest } from './ServerRequest.js';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.js';
import { CookieParamCollection } from '../Param/CookieParamCollection.js';
import { ParsedBodyParamCollection } from '../Param/ParsedBodyParamCollection.js';
import { ParsedJsonParamCollection } from '../Param/ParsedJsonParamCollection.js';
import { QueryParamCollection } from '../Param/QueryParamCollection.js';
import { ServerParamCollection } from '../Param/ServerParamCollection.js';
import { UploadedFileCollection } from '../File/Collection/UploadedFileCollection.js';
import { ContentTypeValue } from '../Constant/ContentTypeValue.js';
import { HeaderName } from '../Constant/HeaderName.js';
import { ProtocolVersion } from '../Enum/ProtocolVersion.js';
import { RequestMethod } from '../Enum/RequestMethod.js';
import { Stream } from '../Stream/Stream.js';
import { Uri } from '../Uri/Uri.js';

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
        files: UploadedFileCollectionContract = new UploadedFileCollection()
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
        const clone        = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.parsedJson   = params;
        return clone;
    }
}

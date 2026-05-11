import type { ServerRequestContract } from './Contract/ServerRequestContract.js';
import type { UriContract } from '../Uri/Contract/UriContract.js';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import type { StreamContract } from '../Stream/Contract/StreamContract.js';
import type { UploadedFileCollectionContract } from '../File/Collection/Contract/UploadedFileCollectionContract.js';
import type { AttributeParamCollectionContract } from '../Param/Contract/AttributeParamCollectionContract.js';
import type { CookieParamCollectionContract } from '../Param/Contract/CookieParamCollectionContract.js';
import type { ParsedBodyParamCollectionContract } from '../Param/Contract/ParsedBodyParamCollectionContract.js';
import type { QueryParamCollectionContract } from '../Param/Contract/QueryParamCollectionContract.js';
import type { ServerParamCollectionContract } from '../Param/Contract/ServerParamCollectionContract.js';
import { Request } from './Request.js';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.js';
import { AttributeParamCollection } from '../Param/AttributeParamCollection.js';
import { CookieParamCollection } from '../Param/CookieParamCollection.js';
import { ParsedBodyParamCollection } from '../Param/ParsedBodyParamCollection.js';
import { QueryParamCollection } from '../Param/QueryParamCollection.js';
import { ServerParamCollection } from '../Param/ServerParamCollection.js';
import { UploadedFileCollection } from '../File/Collection/UploadedFileCollection.js';
import { HeaderName } from '../Constant/HeaderName.js';
import { ProtocolVersion } from '../Enum/ProtocolVersion.js';
import { RequestMethod } from '../Enum/RequestMethod.js';
import { Stream } from '../Stream/Stream.js';
import { Uri } from '../Uri/Uri.js';

export class ServerRequest extends Request implements ServerRequestContract {
    constructor(
        uri: UriContract = new Uri(),
        method: RequestMethod = RequestMethod.GET,
        body: StreamContract = new Stream(),
        headers: HeaderCollectionContract = new HeaderCollection(),
        protocol: ProtocolVersion = ProtocolVersion.V1_1,
        protected server: ServerParamCollectionContract = new ServerParamCollection(),
        protected cookies: CookieParamCollectionContract = new CookieParamCollection(),
        protected query: QueryParamCollectionContract = new QueryParamCollection(),
        protected parsedBody: ParsedBodyParamCollectionContract = new ParsedBodyParamCollection(),
        protected files: UploadedFileCollectionContract = new UploadedFileCollection(),
        protected attributes: AttributeParamCollectionContract = new AttributeParamCollection()
    ) {
        super(uri, method, body, headers);
        this.protocolVersion = protocol;
    }

    getServerParams(): ServerParamCollectionContract {
        return this.server;
    }

    withServerParams(server: ServerParamCollectionContract): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.server = server;
        return clone;
    }

    getCookieParams(): CookieParamCollectionContract {
        return this.cookies;
    }

    withCookieParams(cookies: CookieParamCollectionContract): this {
        const clone   = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.cookies = cookies;
        return clone;
    }

    getQueryParams(): QueryParamCollectionContract {
        return this.query;
    }

    withQueryParams(query: QueryParamCollectionContract): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.query  = query;
        return clone;
    }

    getUploadedFiles(): UploadedFileCollectionContract {
        return this.files;
    }

    withUploadedFiles(uploadedFiles: UploadedFileCollectionContract): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.files  = uploadedFiles;
        return clone;
    }

    getParsedBody(): ParsedBodyParamCollectionContract {
        return this.parsedBody;
    }

    withParsedBody(params: ParsedBodyParamCollectionContract): this {
        const clone        = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.parsedBody   = params;
        return clone;
    }

    getAttributes(): AttributeParamCollectionContract {
        return this.attributes;
    }

    withAttributes(attributes: AttributeParamCollectionContract): this {
        const clone        = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.attributes   = attributes;
        return clone;
    }

    isXmlHttpRequest(): boolean {
        return this.headers.getHeaderLine(HeaderName.X_REQUESTED_WITH) === 'XMLHttpRequest';
    }
}

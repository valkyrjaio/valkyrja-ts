import type { RequestContract } from './RequestContract.js';
import type { UploadedFileCollectionContract } from '../../File/Collection/Contract/UploadedFileCollectionContract.js';
import type { AttributeParamCollectionContract } from '../../Param/Contract/AttributeParamCollectionContract.js';
import type { CookieParamCollectionContract } from '../../Param/Contract/CookieParamCollectionContract.js';
import type { ParsedBodyParamCollectionContract } from '../../Param/Contract/ParsedBodyParamCollectionContract.js';
import type { QueryParamCollectionContract } from '../../Param/Contract/QueryParamCollectionContract.js';
import type { ServerParamCollectionContract } from '../../Param/Contract/ServerParamCollectionContract.js';

export interface ServerRequestContract extends RequestContract {
    getServerParams(): ServerParamCollectionContract;
    withServerParams(server: ServerParamCollectionContract): this;
    getCookieParams(): CookieParamCollectionContract;
    withCookieParams(cookies: CookieParamCollectionContract): this;
    getQueryParams(): QueryParamCollectionContract;
    withQueryParams(query: QueryParamCollectionContract): this;
    getUploadedFiles(): UploadedFileCollectionContract;
    withUploadedFiles(uploadedFiles: UploadedFileCollectionContract): this;
    getParsedBody(): ParsedBodyParamCollectionContract;
    withParsedBody(params: ParsedBodyParamCollectionContract): this;
    getAttributes(): AttributeParamCollectionContract;
    withAttributes(attributes: AttributeParamCollectionContract): this;
    isXmlHttpRequest(): boolean;
}
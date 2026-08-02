/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RequestContract } from './RequestContract.ts';
import type { UploadedFileCollectionContract } from '../../File/Collection/Contract/UploadedFileCollectionContract.ts';
import type { AttributeParamCollectionContract } from '../../Param/Contract/AttributeParamCollectionContract.ts';
import type { CookieParamCollectionContract } from '../../Param/Contract/CookieParamCollectionContract.ts';
import type { ParsedBodyParamCollectionContract } from '../../Param/Contract/ParsedBodyParamCollectionContract.ts';
import type { QueryParamCollectionContract } from '../../Param/Contract/QueryParamCollectionContract.ts';
import type { ServerParamCollectionContract } from '../../Param/Contract/ServerParamCollectionContract.ts';

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

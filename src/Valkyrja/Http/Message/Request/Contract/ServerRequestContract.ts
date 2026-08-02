/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

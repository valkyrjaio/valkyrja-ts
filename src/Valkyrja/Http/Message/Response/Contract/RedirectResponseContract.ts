/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ResponseContract } from './ResponseContract.ts';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.ts';
import type { ServerRequestContract } from '../../Request/Contract/ServerRequestContract.ts';
import type { UriContract } from '../../Uri/Contract/UriContract.ts';
import type { StatusCode } from '../../Enum/StatusCode.ts';

export interface RedirectResponseContract extends ResponseContract {
    createFromUri(
        uri?: UriContract | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): this;
    getUri(): UriContract;
    withUri(uri: UriContract): this;
    secure(path: string, request: ServerRequestContract): this;
    back(request: ServerRequestContract): this;
}

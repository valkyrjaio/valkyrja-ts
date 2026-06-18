/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

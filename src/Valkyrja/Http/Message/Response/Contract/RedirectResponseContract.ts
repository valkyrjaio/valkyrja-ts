import type { ResponseContract } from './ResponseContract.js';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.js';
import type { ServerRequestContract } from '../../Request/Contract/ServerRequestContract.js';
import type { UriContract } from '../../Uri/Contract/UriContract.js';
import type { StatusCode } from '../../Enum/StatusCode.js';

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

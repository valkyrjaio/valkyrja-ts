import type { MessageContract } from '../../Contract/MessageContract.js';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.js';
import type { CookieContract } from '../../Header/Value/Contract/CookieContract.js';
import type { StatusCode } from '../../Enum/StatusCode.js';

export interface ResponseContract extends MessageContract {
    create(
        content?: string | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null
    ): this;
    getStatusCode(): StatusCode;
    withStatusCode(code: StatusCode): this;
    getReasonPhrase(): string;
    withReasonPhrase(reasonPhrase: string): this;
    withCookie(cookie: CookieContract): this;
    withoutCookie(cookie: CookieContract): this;
}

import type { ResponseContract } from './ResponseContract.js';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.js';
import type { StatusCode } from '../../Enum/StatusCode.js';

export interface JsonResponseContract extends ResponseContract {
    createFromData(
        data?: Record<string, unknown> | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): this;
    getBodyAsJson(): Record<string, unknown>;
    withJsonAsBody(data: Record<string, unknown>): this;
    withCallback(callback: string): this;
    withoutCallback(): this;
}

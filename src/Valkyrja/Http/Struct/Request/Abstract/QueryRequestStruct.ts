import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import { RequestStruct } from './RequestStruct.js';

export abstract class QueryRequestStruct extends RequestStruct {
    protected getOnlyParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        return request.getQueryParams().getOnly(...keys) as Record<string, unknown>;
    }

    protected getExceptParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        return request.getQueryParams().getAllExcept(...keys) as Record<string, unknown>;
    }
}
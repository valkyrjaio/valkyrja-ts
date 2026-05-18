import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import { RequestStruct } from './RequestStruct.js';

export abstract class ParsedBodyRequestStruct extends RequestStruct {
    protected getOnlyParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        return request.getParsedBody().getOnly(...keys);
    }

    protected getExceptParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        return request.getParsedBody().getAllExcept(...keys);
    }
}

import type { JsonServerRequestContract } from '../../../Message/Request/Contract/JsonServerRequestContract.js';
import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import { HttpStructJsonServerRequestExpectedException } from '../../Throwable/Exception/HttpStructJsonServerRequestExpectedException.js';
import { RequestStruct } from './RequestStruct.js';

export abstract class JsonRequestStruct extends RequestStruct {
    protected getOnlyParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        this.ensureJsonRequest(request);

        return request.getParsedJson().getOnly(...keys);
    }

    protected getExceptParamsFromRequest(request: ServerRequestContract, ...keys: string[]): Record<string, unknown> {
        this.ensureJsonRequest(request);

        return request.getParsedJson().getAllExcept(...keys);
    }

    protected ensureJsonRequest(request: ServerRequestContract): asserts request is JsonServerRequestContract {
        if (!('getParsedJson' in request)) {
            throw new HttpStructJsonServerRequestExpectedException('JsonServerRequest is required for this to work.');
        }
    }
}

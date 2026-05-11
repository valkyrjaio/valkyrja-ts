import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { StructContract } from '../../Contract/StructContract.js';

export interface RequestStructContract extends StructContract {
    getDataFromRequest(request: ServerRequestContract): Record<string, unknown>;
    determineIfRequestContainsExtraData(request: ServerRequestContract): boolean;
}

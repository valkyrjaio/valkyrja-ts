import type { RequestMethod } from '../../../Message/Enum/RequestMethod.js';
import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface MatcherContract {
    match(path: string, requestMethod: RequestMethod): RouteContract | null;
    matchStatic(path: string, requestMethod: RequestMethod): RouteContract | null;
    matchDynamic(path: string, requestMethod: RequestMethod): RouteContract | null;
}

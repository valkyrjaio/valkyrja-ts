import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import type { RouteMatchedHandlerContract } from '../Handler/Contract/RouteMatchedHandlerContract.js';

export interface RouteMatchedMiddlewareContract {
    routeMatched(input: InputContract, route: RouteContract, handler: RouteMatchedHandlerContract): RouteContract | OutputContract;
}
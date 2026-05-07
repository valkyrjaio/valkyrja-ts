import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.js';

export interface RouteNotMatchedMiddlewareContract {
    routeNotMatched(input: InputContract, output: OutputContract, handler: RouteNotMatchedHandlerContract): OutputContract;
}
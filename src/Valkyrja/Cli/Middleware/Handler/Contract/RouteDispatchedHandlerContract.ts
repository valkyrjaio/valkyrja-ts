import type { InputContract } from '../../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../../Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '../../../../Routing/Data/Contract/RouteContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface RouteDispatchedHandlerContract extends HandlerContract {
    routeDispatched(input: InputContract, output: OutputContract, route: RouteContract): OutputContract;
}
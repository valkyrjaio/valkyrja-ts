import type { InputContract } from '../../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../../Interaction/Output/Contract/OutputContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface RouteNotMatchedHandlerContract extends HandlerContract {
    routeNotMatched(input: InputContract, output: OutputContract): OutputContract;
}
import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface RouteNotMatchedHandlerContract extends HandlerContract {
    routeNotMatched(input: InputContract, output: OutputContract): OutputContract;
}

export namespace RouteNotMatchedHandlerContract {
    export function instanceOf(value: unknown): value is RouteNotMatchedHandlerContract {
        return typeof value === 'object' && value !== null && 'routeNotMatched' in value;
    }
}

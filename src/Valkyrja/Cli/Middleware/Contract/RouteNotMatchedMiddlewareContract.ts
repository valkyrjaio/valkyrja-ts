import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.js';

export interface RouteNotMatchedMiddlewareContract {
    routeNotMatched(input: InputContract, output: OutputContract, handler: RouteNotMatchedHandlerContract): OutputContract;
}

export namespace RouteNotMatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteNotMatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeNotMatched' in value;
    }
}

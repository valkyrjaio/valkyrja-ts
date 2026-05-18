import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface RouteMatchedHandlerContract extends HandlerContract {
    routeMatched(input: InputContract, route: RouteContract): RouteContract | OutputContract;
}

export namespace RouteMatchedHandlerContract {
    export function instanceOf(value: unknown): value is RouteMatchedHandlerContract {
        return typeof value === 'object' && value !== null && 'routeMatched' in value;
    }
}

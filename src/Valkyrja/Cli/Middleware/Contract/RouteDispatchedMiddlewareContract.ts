import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import type { RouteDispatchedHandlerContract } from '../Handler/Contract/RouteDispatchedHandlerContract.js';

export interface RouteDispatchedMiddlewareContract {
    routeDispatched(
        input: InputContract,
        output: OutputContract,
        route: RouteContract,
        handler: RouteDispatchedHandlerContract,
    ): OutputContract;
}

export namespace RouteDispatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteDispatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeDispatched' in value;
    }
}

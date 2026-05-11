import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import type { RouteDispatchedMiddlewareContract } from '../Contract/RouteDispatchedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { RouteDispatchedHandlerContract } from './Contract/RouteDispatchedHandlerContract.js';

export class RouteDispatchedHandler extends Handler implements RouteDispatchedHandlerContract {
    routeDispatched(input: InputContract, output: OutputContract, route: RouteContract): OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<RouteDispatchedMiddlewareContract>(next).routeDispatched(input, output, route, this)
            : output;
    }
}

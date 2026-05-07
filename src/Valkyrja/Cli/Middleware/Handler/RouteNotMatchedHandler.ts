import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { RouteNotMatchedMiddlewareContract } from '../Contract/RouteNotMatchedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { RouteNotMatchedHandlerContract } from './Contract/RouteNotMatchedHandlerContract.js';

export class RouteNotMatchedHandler extends Handler implements RouteNotMatchedHandlerContract {
    routeNotMatched(input: InputContract, output: OutputContract): OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<RouteNotMatchedMiddlewareContract>(next).routeNotMatched(input, output, this)
            : output;
    }
}
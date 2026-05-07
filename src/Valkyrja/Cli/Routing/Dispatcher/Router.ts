import { Container } from '../../../Container/Manager/Container.js';
import { ExitCode } from '../../Interaction/Enum/ExitCode.js';
import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import { Banner } from '../../Interaction/Message/Banner.js';
import { ErrorMessage } from '../../Interaction/Message/ErrorMessage.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import { OutputFactory } from '../../Interaction/Output/Factory/OutputFactory.js';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import { ExitedHandler } from '../../Middleware/Handler/ExitedHandler.js';
import type { ExitedHandlerContract } from '../../Middleware/Handler/Contract/ExitedHandlerContract.js';
import { RouteDispatchedHandler } from '../../Middleware/Handler/RouteDispatchedHandler.js';
import type { RouteDispatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.js';
import { RouteMatchedHandler } from '../../Middleware/Handler/RouteMatchedHandler.js';
import type { RouteMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteMatchedHandlerContract.js';
import { RouteNotMatchedHandler } from '../../Middleware/Handler/RouteNotMatchedHandler.js';
import type { RouteNotMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.js';
import { ThrowableCaughtHandler } from '../../Middleware/Handler/ThrowableCaughtHandler.js';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.js';
import { RouteCollection } from '../Collection/RouteCollection.js';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.js';
import type { ArgumentParameterContract } from '../Data/Contract/ArgumentParameterContract.js';
import type { OptionParameterContract } from '../Data/Contract/OptionParameterContract.js';
import type { RouteContract } from '../Data/Contract/RouteContract.js';
import { ArgumentValueMode } from '../Enum/ArgumentValueMode.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import { CliRoutingServiceId } from '../Constant/CliRoutingServiceId.js';
import type { RouterContract } from './Contract/RouterContract.js';

export class Router implements RouterContract {
    constructor(
        protected container: ContainerContract = new Container(),
        protected collection: RouteCollectionContract = new RouteCollection(),
        protected outputFactory: OutputFactoryContract = new OutputFactory(),
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract = new ThrowableCaughtHandler(),
        protected routeMatchedHandler: RouteMatchedHandlerContract = new RouteMatchedHandler(),
        protected routeNotMatchedHandler: RouteNotMatchedHandlerContract = new RouteNotMatchedHandler(),
        protected routeDispatchedHandler: RouteDispatchedHandlerContract = new RouteDispatchedHandler(),
        protected exitedHandler: ExitedHandlerContract = new ExitedHandler(),
    ) {}

    dispatch(input: InputContract): OutputContract {
        const matchedRoute = this.attemptToMatchRoute(input);

        if (!this.isRouteContract(matchedRoute)) {
            return this.routeNotMatchedHandler.routeNotMatched(input, matchedRoute);
        }

        return this.dispatchRoute(input, matchedRoute);
    }

    dispatchRoute(input: InputContract, route: RouteContract): OutputContract {
        route = this.addParametersToRoute(input, route);

        this.routeMatched(route);

        const routeAfterMiddleware = this.routeMatchedHandler.routeMatched(input, route);

        if (!this.isRouteContract(routeAfterMiddleware)) {
            return routeAfterMiddleware;
        }

        this.container.setSingleton<RouteContract>(CliRoutingServiceId.RouteContract, routeAfterMiddleware);

        const handler = routeAfterMiddleware.getHandler();
        const output  = handler(this.container, routeAfterMiddleware);

        return this.routeDispatchedHandler.routeDispatched(input, output, routeAfterMiddleware);
    }

    protected attemptToMatchRoute(input: InputContract): RouteContract | OutputContract {
        const commandName = input.getCommandName();

        if (this.collection.has(commandName)) {
            return this.collection.get(commandName);
        }

        const errorText = `Command \`${commandName}\` was not found.`;

        return this.outputFactory
            .createOutput(ExitCode.ERROR)
            .withMessages(new Banner(new ErrorMessage(errorText)));
    }

    protected addParametersToRoute(input: InputContract, route: RouteContract): RouteContract {
        route = this.addArgumentsToRoute(input, route);

        return this.addOptionsToRoute(input, route);
    }

    protected addArgumentsToRoute(input: InputContract, route: RouteContract): RouteContract {
        const arguments_          = [...input.getArguments()];
        const argumentParameters  = route.getArguments();
        const updatedParams: ArgumentParameterContract[] = [];

        for (let i = 0; i < argumentParameters.length; i++) {
            let param = argumentParameters[i]!;

            let paramArguments: typeof arguments_ = [];

            if (param.getValueMode() === ArgumentValueMode.ARRAY) {
                paramArguments = arguments_.splice(0);
            } else if (arguments_[i] !== undefined) {
                paramArguments = [arguments_[i]!];
                arguments_.splice(i, 1);
            }

            updatedParams.push(param.withArguments(...paramArguments).validateValues());
        }

        return route.withArguments(...updatedParams);
    }

    protected addOptionsToRoute(input: InputContract, route: RouteContract): RouteContract {
        const options           = input.getOptions();
        const optionParameters  = [...route.getOptions()];
        const updatedParams: OptionParameterContract[] = [];

        for (const param of optionParameters) {
            const paramOptions = options.filter(
                (opt) => param.getName() === opt.getName() || param.getShortNames().includes(opt.getName()),
            );

            updatedParams.push(param.withOptions(...paramOptions).validateValues());
        }

        return route.withOptions(...updatedParams);
    }

    protected routeMatched(route: RouteContract): void {
        this.routeMatchedHandler.add(...route.getRouteMatchedMiddleware());
        this.routeDispatchedHandler.add(...route.getRouteDispatchedMiddleware());
        this.throwableCaughtHandler.add(...route.getThrowableCaughtMiddleware());
        this.exitedHandler.add(...route.getExitedMiddleware());

        this.container.setSingleton<RouteContract>(CliRoutingServiceId.RouteContract, route);
    }

    protected isRouteContract(value: RouteContract | OutputContract): value is RouteContract {
        return 'getHandler' in value;
    }
}
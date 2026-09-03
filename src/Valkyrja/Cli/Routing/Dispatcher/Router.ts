/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Container } from '../../../Container/Manager/Container.ts';
import { ExitCode } from '../../Interaction/Enum/ExitCode.ts';
import type { InputContract } from '../../Interaction/Input/Contract/InputContract.ts';
import { Banner } from '../../Interaction/Message/Banner.ts';
import { ErrorMessage } from '../../Interaction/Message/ErrorMessage.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import { OutputFactory } from '../../Interaction/Output/Factory/OutputFactory.ts';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import { ProcessExitingHandler } from '../../Middleware/Handler/ProcessExitingHandler.ts';
import type { ProcessExitingHandlerContract } from '../../Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';
import { RouteDispatchedHandler } from '../../Middleware/Handler/RouteDispatchedHandler.ts';
import type { RouteDispatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';
import { RouteMatchedHandler } from '../../Middleware/Handler/RouteMatchedHandler.ts';
import type { RouteMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';
import { RouteNotMatchedHandler } from '../../Middleware/Handler/RouteNotMatchedHandler.ts';
import type { RouteNotMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';
import { ThrowableCaughtHandler } from '../../Middleware/Handler/ThrowableCaughtHandler.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import { RouteCollection } from '../Collection/RouteCollection.ts';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.ts';
import type { ArgumentParameterContract } from '../Data/Contract/ArgumentParameterContract.ts';
import type { OptionParameterContract } from '../Data/Contract/OptionParameterContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import { ArgumentValueMode } from '../Enum/ArgumentValueMode.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import { CliRoutingServiceId } from '../Constant/CliRoutingServiceId.ts';
import type { RouterContract } from './Contract/RouterContract.ts';

export class Router implements RouterContract {
    constructor(
        protected container: ContainerContract = new Container(),
        protected collection: RouteCollectionContract = new RouteCollection(),
        protected outputFactory: OutputFactoryContract = new OutputFactory(),
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract = new ThrowableCaughtHandler(),
        protected routeMatchedHandler: RouteMatchedHandlerContract = new RouteMatchedHandler(),
        protected routeNotMatchedHandler: RouteNotMatchedHandlerContract = new RouteNotMatchedHandler(),
        protected routeDispatchedHandler: RouteDispatchedHandlerContract = new RouteDispatchedHandler(),
        protected processExitingHandler: ProcessExitingHandlerContract = new ProcessExitingHandler(),
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
        const output = handler(this.container, routeAfterMiddleware);

        return this.routeDispatchedHandler.routeDispatched(input, output, routeAfterMiddleware);
    }

    protected attemptToMatchRoute(input: InputContract): RouteContract | OutputContract {
        const commandName = input.getCommandName();

        if (this.collection.has(commandName)) {
            return this.collection.get(commandName);
        }

        const errorText = `Command \`${commandName}\` was not found.`;

        return this.outputFactory.createOutput(ExitCode.ERROR).withMessages(new Banner(new ErrorMessage(errorText)));
    }

    protected addParametersToRoute(input: InputContract, route: RouteContract): RouteContract {
        route = this.addArgumentsToRoute(input, route);

        return this.addOptionsToRoute(input, route);
    }

    protected addArgumentsToRoute(input: InputContract, route: RouteContract): RouteContract {
        let remaining = [...input.getArguments()];
        const argumentParameters = route.getArguments();
        const updatedParams: ArgumentParameterContract[] = [];

        // An array parameter consumes the rest, so a parameter that follows it receives nothing.
        for (const param of argumentParameters) {
            let paramArguments: typeof remaining = [];

            if (param.getValueMode() === ArgumentValueMode.ARRAY) {
                paramArguments = remaining;
                remaining = [];
            } else {
                const arg = remaining.shift();
                if (arg !== undefined) {
                    paramArguments = [arg];
                }
            }

            updatedParams.push(
                param
                    .withContainer(this.container)
                    .withArguments(...paramArguments)
                    .validateValues(),
            );
        }

        return route.withArguments(...updatedParams);
    }

    protected addOptionsToRoute(input: InputContract, route: RouteContract): RouteContract {
        const options = input.getOptions();
        const optionParameters = [...route.getOptions()];
        const updatedParams: OptionParameterContract[] = [];

        for (const param of optionParameters) {
            const paramOptions = options.filter(
                (opt) => param.getName() === opt.getName() || param.getShortNames().includes(opt.getName()),
            );

            updatedParams.push(
                param
                    .withContainer(this.container)
                    .withOptions(...paramOptions)
                    .validateValues(),
            );
        }

        return route.withOptions(...updatedParams);
    }

    protected routeMatched(route: RouteContract): void {
        this.routeMatchedHandler.add(...route.getRouteMatchedMiddleware());
        this.routeDispatchedHandler.add(...route.getRouteDispatchedMiddleware());
        this.throwableCaughtHandler.add(...route.getThrowableCaughtMiddleware());
        this.processExitingHandler.add(...route.getProcessExitingMiddleware());

        this.container.setSingleton<RouteContract>(CliRoutingServiceId.RouteContract, route);
    }

    protected isRouteContract(value: RouteContract | OutputContract): value is RouteContract {
        return 'getHandler' in value;
    }
}

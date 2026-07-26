/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Output } from '../../Interaction/Output/Output.ts';
import { readCliRouteMetadata } from '../Attribute/RouteAttributeMetadata.ts';
import { ArgumentParameter } from '../Data/ArgumentParameter.ts';
import { OptionParameter } from '../Data/OptionParameter.ts';
import { Route } from '../Data/Route.ts';
import { ArgumentMode } from '../Enum/ArgumentMode.ts';
import { ArgumentValueMode } from '../Enum/ArgumentValueMode.ts';
import { OptionMode } from '../Enum/OptionMode.ts';
import { OptionValueMode } from '../Enum/OptionValueMode.ts';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type {
    CliHandlerReference,
    CliHelpTextReference,
    CliMiddlewareReference,
    CliRouteDefinition,
    CliRouteMethodMetadata,
} from '../Attribute/RouteAttributeMetadata.ts';
import type { ArgumentParameterOptions, OptionParameterOptions } from '../Attribute/RouteOptions.ts';
import type { ArgumentParameterContract } from '../Data/Contract/ArgumentParameterContract.ts';
import type { OptionParameterContract } from '../Data/Contract/OptionParameterContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { RouteCollectorContract } from './Contract/RouteCollectorContract.ts';

type CliHandler = (container: ContainerContract, route: RouteContract) => OutputContract;

/**
 * Builds CLI commands from the decorator metadata attached to controller
 * classes, without executing or re-parsing any source.
 *
 * Mirrors the framework's PHP `Cli\Routing\AttributeRouteCollector`, reading the
 * standard Stage-3 decorator metadata (`Controller[Symbol.metadata]`) the CLI
 * routing decorators write. Used on the uncached (debug) path.
 */
export class AttributeRouteCollector implements RouteCollectorContract {
    getRoutes(...classes: Array<new (...args: unknown[]) => unknown>): RouteContract[] {
        const routes: RouteContract[] = [];

        for (const controller of classes) {
            const metadata = readCliRouteMetadata(controller);

            if (metadata === null) {
                continue;
            }

            const className = metadata.classNames[0] ?? '';

            for (const method of metadata.methods.values()) {
                for (const definition of method.routes) {
                    routes.push(this.buildRoute(definition, method, className));
                }
            }
        }

        return routes;
    }

    protected buildRoute(
        definition: CliRouteDefinition,
        method: CliRouteMethodMetadata,
        className: string,
    ): RouteContract {
        const handler = this.resolveHandler(method.handler ?? definition.handler);
        const helpText = this.resolveHelpText(definition.helpText);

        let route: RouteContract = new Route(
            definition.name,
            definition.description,
            handler,
            helpText,
            [],
            [],
            [],
            [],
            method.arguments.map((argument) => this.buildArgument(argument)),
            method.options.map((option) => this.buildOption(option)),
        );

        route = this.applyName(route, className, method.names);
        route = this.applyMiddleware(route, [...definition.middleware, ...method.middleware]);

        return route;
    }

    protected resolveHandler(reference: CliHandlerReference | null): CliHandler {
        if (reference === null) {
            return AttributeRouteCollector.defaultHandler;
        }

        const [provider, methodName] = reference;
        const handler = (provider as unknown as Record<string, CliHandler | undefined>)[methodName];

        return handler ?? AttributeRouteCollector.defaultHandler;
    }

    protected resolveHelpText(reference: CliHelpTextReference | null): (() => MessageContract) | null {
        if (reference === null) {
            return null;
        }

        const [source, methodName] = reference;

        return (source as unknown as Record<string, (() => MessageContract) | undefined>)[methodName] ?? null;
    }

    protected applyName(route: RouteContract, className: string, methodNames: string[]): RouteContract {
        if (className !== '') {
            route = route.withName(className + '.' + route.getName());
        }

        const methodName = methodNames[0];

        if (methodName !== undefined) {
            route = route.withName(route.getName() + '.' + methodName);
        }

        return route;
    }

    protected applyMiddleware(route: RouteContract, middleware: CliMiddlewareReference[]): RouteContract {
        for (const reference of middleware) {
            const prototype = reference.prototype as unknown as Record<string, unknown>;

            if (typeof prototype.routeMatched === 'function') {
                route = route.withAddedRouteMatchedMiddleware(reference.name);
            }

            if (typeof prototype.routeDispatched === 'function') {
                route = route.withAddedRouteDispatchedMiddleware(reference.name);
            }

            if (typeof prototype.throwableCaught === 'function') {
                route = route.withAddedThrowableCaughtMiddleware(reference.name);
            }

            if (typeof prototype.processExiting === 'function') {
                route = route.withAddedProcessExitingMiddleware(reference.name);
            }
        }

        return route;
    }

    protected buildArgument(options: ArgumentParameterOptions): ArgumentParameterContract {
        return new ArgumentParameter(
            options.name,
            options.description,
            options.cast ?? null,
            options.mode ?? ArgumentMode.OPTIONAL,
            options.valueMode ?? ArgumentValueMode.DEFAULT,
        );
    }

    protected buildOption(options: OptionParameterOptions): OptionParameterContract {
        return new OptionParameter(
            options.name,
            options.description,
            options.valueDisplayName ?? '',
            options.cast ?? null,
            options.defaultValue ?? '',
            options.shortNames ?? [],
            options.validValues ?? [],
            [],
            options.mode ?? OptionMode.OPTIONAL,
            options.valueMode ?? OptionValueMode.DEFAULT,
        );
    }

    protected static defaultHandler(this: void): OutputContract {
        return new Output();
    }
}

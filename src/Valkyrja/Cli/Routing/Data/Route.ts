import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ArgumentParameterContract } from './Contract/ArgumentParameterContract.js';
import type { OptionParameterContract } from './Contract/OptionParameterContract.js';
import type { RouteContract } from './Contract/RouteContract.js';
import { CliRoutingInvalidArgumentNameException } from '../Throwable/Exception/CliRoutingInvalidArgumentNameException.js';
import { CliRoutingInvalidOptionNameException } from '../Throwable/Exception/CliRoutingInvalidOptionNameException.js';
import { CliRoutingNoHelpTextException } from '../Throwable/Exception/CliRoutingNoHelpTextException.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

export class Route implements RouteContract {
    constructor(
        protected name: string,
        protected description: string,
        protected handler: (container: ContainerContract, route: RouteContract) => OutputContract,
        protected helpText: (() => MessageContract) | null = null,
        protected routeMatchedMiddleware: string[] = [],
        protected routeDispatchedMiddleware: string[] = [],
        protected throwableCaughtMiddleware: string[] = [],
        protected exitedMiddleware: string[] = [],
        protected arguments_: ArgumentParameterContract[] = [],
        protected options: OptionParameterContract[] = [],
    ) {}

    getName(): string {
        return this.name;
    }

    withName(name: string): this {
        const clone = ObjectFactory.clone(this);
        clone.name = name;
        return clone;
    }

    getDescription(): string {
        return this.description;
    }

    withDescription(description: string): this {
        const clone = ObjectFactory.clone(this);
        clone.description = description;
        return clone;
    }

    hasHelpText(): boolean {
        return this.helpText !== null;
    }

    getHelpText(): () => MessageContract {
        if (this.helpText === null) {
            throw new CliRoutingNoHelpTextException('No help text has been set for this route');
        }
        return this.helpText;
    }

    getHelpTextMessage(): MessageContract {
        return this.getHelpText()();
    }

    withHelpText(helpText: () => MessageContract): this {
        const clone = ObjectFactory.clone(this);
        clone.helpText = helpText;
        return clone;
    }

    hasArguments(): boolean {
        return this.arguments_.length > 0;
    }
    getArguments(): ArgumentParameterContract[] {
        return this.arguments_;
    }

    hasArgument(name: string): boolean {
        return this.arguments_.some((a) => a.getName() === name);
    }

    getArgument(name: string): ArgumentParameterContract {
        const found = this.arguments_.find((a) => a.getName() === name);
        if (found === undefined) {
            throw new CliRoutingInvalidArgumentNameException(`The argument \`${name}\` was not found`);
        }
        return found;
    }

    withArguments(...arguments_: ArgumentParameterContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.arguments_ = arguments_;
        return clone;
    }

    withAddedArguments(...arguments_: ArgumentParameterContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.arguments_ = [...this.arguments_, ...arguments_];
        return clone;
    }

    hasOptions(): boolean {
        return this.options.length > 0;
    }
    getOptions(): OptionParameterContract[] {
        return this.options;
    }

    hasOption(name: string): boolean {
        return this.options.some((o) => o.getName() === name);
    }

    getOption(name: string): OptionParameterContract {
        const found = this.options.find((o) => o.getName() === name);
        if (found === undefined) {
            throw new CliRoutingInvalidOptionNameException(`The option \`${name}\` was not found`);
        }
        return found;
    }

    withOptions(...options: OptionParameterContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.options = options;
        return clone;
    }

    withAddedOptions(...options: OptionParameterContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.options = [...this.options, ...options];
        return clone;
    }

    getRouteMatchedMiddleware(): string[] {
        return this.routeMatchedMiddleware;
    }

    withRouteMatchedMiddleware(...middleware: string[]): this {
        const clone = ObjectFactory.clone(this);
        clone.routeMatchedMiddleware = middleware;
        return clone;
    }

    withAddedRouteMatchedMiddleware(...middleware: string[]): this {
        const clone = ObjectFactory.clone(this);
        clone.routeMatchedMiddleware = [...this.routeMatchedMiddleware, ...middleware];
        return clone;
    }

    getRouteDispatchedMiddleware(): string[] {
        return this.routeDispatchedMiddleware;
    }

    withRouteDispatchedMiddleware(...middleware: string[]): this {
        const clone = ObjectFactory.clone(this);
        clone.routeDispatchedMiddleware = middleware;
        return clone;
    }

    withAddedRouteDispatchedMiddleware(...middleware: string[]): this {
        const clone = ObjectFactory.clone(this);
        clone.routeDispatchedMiddleware = [...this.routeDispatchedMiddleware, ...middleware];
        return clone;
    }

    getThrowableCaughtMiddleware(): string[] {
        return this.throwableCaughtMiddleware;
    }

    withThrowableCaughtMiddleware(...middleware: string[]): this {
        const clone = ObjectFactory.clone(this);
        clone.throwableCaughtMiddleware = middleware;
        return clone;
    }

    withAddedThrowableCaughtMiddleware(...middleware: string[]): this {
        const clone = ObjectFactory.clone(this);
        clone.throwableCaughtMiddleware = [...this.throwableCaughtMiddleware, ...middleware];
        return clone;
    }

    getExitedMiddleware(): string[] {
        return this.exitedMiddleware;
    }

    withExitedMiddleware(...middleware: string[]): this {
        const clone = ObjectFactory.clone(this);
        clone.exitedMiddleware = middleware;
        return clone;
    }

    withAddedExitedMiddleware(...middleware: string[]): this {
        const clone = ObjectFactory.clone(this);
        clone.exitedMiddleware = [...this.exitedMiddleware, ...middleware];
        return clone;
    }

    getHandler(): (container: ContainerContract, route: RouteContract) => OutputContract {
        return this.handler;
    }

    withHandler(handler: (container: ContainerContract, route: RouteContract) => OutputContract): this {
        const clone = ObjectFactory.clone(this);
        clone.handler = handler;
        return clone;
    }
}

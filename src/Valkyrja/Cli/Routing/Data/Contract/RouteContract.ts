/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from '../../../Interaction/Message/Contract/MessageContract.ts';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.ts';
import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.ts';
import type { ArgumentParameterContract } from './ArgumentParameterContract.ts';
import type { OptionParameterContract } from './OptionParameterContract.ts';

export interface RouteContract {
    getName(): string;
    withName(name: string): this;
    getDescription(): string;
    withDescription(description: string): this;
    hasHelpText(): boolean;
    getHelpText(): () => MessageContract;
    getHelpTextMessage(): MessageContract;
    withHelpText(helpText: () => MessageContract): this;
    hasArguments(): boolean;
    getArguments(): ArgumentParameterContract[];
    hasArgument(name: string): boolean;
    getArgument(name: string): ArgumentParameterContract;
    hasProvidedArgument(name: string): boolean;
    getArgumentValue(name: string, defaultValue?: string): string;
    withArguments(...arguments_: ArgumentParameterContract[]): this;
    withAddedArguments(...arguments_: ArgumentParameterContract[]): this;
    hasOptions(): boolean;
    getOptions(): OptionParameterContract[];
    hasOption(name: string): boolean;
    getOption(name: string): OptionParameterContract;
    hasProvidedOption(name: string): boolean;
    getOptionValue(name: string, defaultValue?: string | null): string;
    withOptions(...options: OptionParameterContract[]): this;
    withAddedOptions(...options: OptionParameterContract[]): this;
    getRouteMatchedMiddleware(): string[];
    withRouteMatchedMiddleware(...middleware: string[]): this;
    withAddedRouteMatchedMiddleware(...middleware: string[]): this;
    getRouteDispatchedMiddleware(): string[];
    withRouteDispatchedMiddleware(...middleware: string[]): this;
    withAddedRouteDispatchedMiddleware(...middleware: string[]): this;
    getThrowableCaughtMiddleware(): string[];
    withThrowableCaughtMiddleware(...middleware: string[]): this;
    withAddedThrowableCaughtMiddleware(...middleware: string[]): this;
    getProcessExitingMiddleware(): string[];
    withProcessExitingMiddleware(...middleware: string[]): this;
    withAddedProcessExitingMiddleware(...middleware: string[]): this;
    getHandler(): (container: ContainerContract, route: RouteContract) => OutputContract;
    withHandler(handler: (container: ContainerContract, route: RouteContract) => OutputContract): this;
}

export namespace RouteContract {
    export function instanceOf(value: unknown): value is RouteContract {
        return typeof value === 'object' && value !== null && 'getName' in value;
    }
}

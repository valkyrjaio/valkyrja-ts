/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ArgumentParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/ArgumentParameter.ts';
import { OptionParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/OptionParameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route.ts';
import { Middleware } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route/Middleware.ts';
import { Name } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route/Name.ts';
import { RouteHandler } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route/RouteHandler.ts';
import {
    createCliRouteDefinition,
    ensureCliRouteMethodMetadata,
} from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { AttributeRouteCollector } from '../../../../../../src/Valkyrja/Cli/Routing/Collector/AttributeRouteCollector.ts';
import { ArgumentMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/ArgumentMode.ts';
import { ArgumentValueMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/ArgumentValueMode.ts';
import { OptionMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionMode.ts';
import { OptionValueMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionValueMode.ts';
import { Cast } from '../../../../../../src/Valkyrja/Type/Data/Cast.ts';
import {
    attachMetadata,
    classDecoratorContext,
    methodDecoratorContext,
} from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';

import type { MessageContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/MessageContract.ts';
import type { CliMiddlewareReference } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import type { ContainerContract } from '../../../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';

const container = {} as ContainerContract;
const helpMessage = { marker: 'help' } as unknown as MessageContract;

class CliRouteProvider {
    static testCommandHandler(): Output {
        return new Output();
    }

    static inlineHandler(): Output {
        return new Output();
    }

    static help(): MessageContract {
        return helpMessage;
    }
}

function mw(prototype: Record<string, () => void>): CliMiddlewareReference {
    const middleware = class {};
    Object.assign(middleware.prototype, prototype);
    Object.defineProperty(middleware, 'name', { value: middleware.prototype.constructor.name || 'Middleware' });

    return middleware as unknown as CliMiddlewareReference;
}

const MatchedMiddleware = mw({ routeMatched: () => undefined });
const DispatchedMiddleware = mw({ routeDispatched: () => undefined });
const CaughtMiddleware = mw({ throwableCaught: () => undefined });
const ProcessExitingMiddleware = mw({ processExiting: () => undefined });
const NoopMiddleware = mw({});

function commandWith(apply: (metadata: DecoratorMetadataObject) => void): new () => unknown {
    const metadata = {} as DecoratorMetadataObject;
    apply(metadata);

    return attachMetadata(class Controller {}, metadata);
}

describe('Cli AttributeRouteCollector', () => {
    it('returns no routes for a class without decorator metadata', () => {
        class Bare {}

        expect(new AttributeRouteCollector().getRoutes(Bare)).toStrictEqual([]);
    });

    it('builds a command, resolving handler and help text from references', () => {
        const controller = commandWith((metadata) => {
            Route({ name: 'test', description: 'Test command', helpText: [() => CliRouteProvider, 'help'] })(
                undefined,
                methodDecoratorContext('run', metadata),
            );
            RouteHandler([() => CliRouteProvider, 'testCommandHandler'])(
                undefined,
                methodDecoratorContext('run', metadata),
            );
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getName()).toBe('test');
        expect(route?.getDescription()).toBe('Test command');
        expect(route?.getHandler()).toBe(CliRouteProvider.testCommandHandler);
        expect(route?.getHelpTextMessage()).toBe(helpMessage);
    });

    it('prefers the dedicated @RouteHandler over an inline @Route handler option', () => {
        const controller = commandWith((metadata) => {
            Route({ name: 'test', description: 'Test command', handler: [() => CliRouteProvider, 'inlineHandler'] })(
                undefined,
                methodDecoratorContext('run', metadata),
            );
            RouteHandler([() => CliRouteProvider, 'testCommandHandler'])(
                undefined,
                methodDecoratorContext('run', metadata),
            );
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getHandler()).toBe(CliRouteProvider.testCommandHandler);
    });

    it('falls back to a default handler and no help text when unset', () => {
        const controller = commandWith((metadata) => {
            Route({ name: 'bare', description: 'Bare command' })(undefined, methodDecoratorContext('run', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getHandler()(container, route)).toBeInstanceOf(Output);
        expect(route?.hasHelpText()).toBe(false);
    });

    it('falls back to a default handler when the referenced method is missing', () => {
        const controller = commandWith((metadata) => {
            Route({ name: 'bare', description: 'Bare command' })(undefined, methodDecoratorContext('run', metadata));
            // `CliHandlerKeys` makes an unknown method name a compile error at the
            // decorator, so the collector's missing-method guard is reachable only
            // through the loose storage form (e.g. stale generated metadata).
            ensureCliRouteMethodMetadata(metadata, 'run').handler = [() => CliRouteProvider, 'missingHandler'];
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getHandler()(container, route)).toBeInstanceOf(Output);
    });

    it('applies class and method name prefixes', () => {
        const controller = commandWith((metadata) => {
            Name('app')(undefined, classDecoratorContext('AppCommand', metadata));
            Route({ name: 'test', description: 'Test command' })(undefined, methodDecoratorContext('run', metadata));
            Name('run')(undefined, methodDecoratorContext('run', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getName()).toBe('app.test.run');
    });

    it('routes each middleware into every bucket it satisfies', () => {
        const controller = commandWith((metadata) => {
            Route({ name: 'test', description: 'Test command' })(undefined, methodDecoratorContext('run', metadata));
            Middleware(MatchedMiddleware)(undefined, methodDecoratorContext('run', metadata));
            Middleware(DispatchedMiddleware)(undefined, methodDecoratorContext('run', metadata));
            Middleware(CaughtMiddleware)(undefined, methodDecoratorContext('run', metadata));
            Middleware(ProcessExitingMiddleware)(undefined, methodDecoratorContext('run', metadata));
            Middleware(NoopMiddleware)(undefined, methodDecoratorContext('run', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRouteMatchedMiddleware()).toStrictEqual([MatchedMiddleware.name]);
        expect(route?.getRouteDispatchedMiddleware()).toStrictEqual([DispatchedMiddleware.name]);
        expect(route?.getThrowableCaughtMiddleware()).toStrictEqual([CaughtMiddleware.name]);
        expect(route?.getProcessExitingMiddleware()).toStrictEqual([ProcessExitingMiddleware.name]);
    });

    it('ignores a help-text reference whose method is missing', () => {
        const controller = commandWith((metadata) => {
            // As above: `CliHelpTextKeys` rejects an unknown name at the decorator,
            // so the guard is exercised through the loose stored definition.
            const definition = createCliRouteDefinition({ name: 'test', description: 'Test command' });
            definition.helpText = [() => CliRouteProvider, 'missingHelp'];

            ensureCliRouteMethodMetadata(metadata, 'run').routes.push(definition);
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.hasHelpText()).toBe(false);
    });

    it('builds arguments and options across provided and default values', () => {
        const cast = new Cast('string');

        const controller = commandWith((metadata) => {
            Route({ name: 'test', description: 'Test command' })(undefined, methodDecoratorContext('run', metadata));
            ArgumentParameter({
                name: 'file',
                description: 'A file',
                cast,
                mode: ArgumentMode.REQUIRED,
                valueMode: ArgumentValueMode.ARRAY,
            })(undefined, methodDecoratorContext('run', metadata));
            ArgumentParameter({ name: 'dir', description: 'A directory' })(
                undefined,
                methodDecoratorContext('run', metadata),
            );
            OptionParameter({
                name: 'verbose',
                description: 'Verbose output',
                valueDisplayName: 'level',
                cast,
                defaultValue: '1',
                shortNames: ['v'],
                validValues: ['1', '2'],
                mode: OptionMode.REQUIRED,
                valueMode: OptionValueMode.ARRAY,
            })(undefined, methodDecoratorContext('run', metadata));
            OptionParameter({ name: 'quiet', description: 'Quiet output' })(
                undefined,
                methodDecoratorContext('run', metadata),
            );
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);
        const [file, dir] = route?.getArguments() ?? [];
        const [verbose, quiet] = route?.getOptions() ?? [];

        expect(file?.getMode()).toBe(ArgumentMode.REQUIRED);
        expect(file?.getCast()).toBe(cast);
        expect(dir?.getMode()).toBe(ArgumentMode.OPTIONAL);
        expect(verbose?.getMode()).toBe(OptionMode.REQUIRED);
        expect(verbose?.getShortNames()).toStrictEqual(['v']);
        expect(quiet?.getShortNames()).toStrictEqual([]);
        expect(quiet?.getMode()).toBe(OptionMode.OPTIONAL);
    });
});

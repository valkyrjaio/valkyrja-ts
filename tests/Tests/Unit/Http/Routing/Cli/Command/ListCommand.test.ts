/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliConfig } from '../../../../../../../src/Valkyrja/Application/Data/CliConfig.ts';
import { CliInteractionConfig } from '../../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { ExitCode } from '../../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { OutputFactory } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { Route as CliRoute } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { RequestMethod } from '../../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { RouteCollection } from '../../../../../../../src/Valkyrja/Http/Routing/Collection/RouteCollection.ts';
import { ListCommand } from '../../../../../../../src/Valkyrja/Http/Routing/Cli/Command/ListCommand.ts';
import { DynamicRoute } from '../../../../../../../src/Valkyrja/Http/Routing/Data/DynamicRoute.ts';
import { Route } from '../../../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';

import type { OutputContract as CliOutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { ResponseContract } from '../../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';

const httpHandler = (): ResponseContract => ({}) as unknown as ResponseContract;
const cliHandler = (): CliOutputContract => new OutputFactory().createOutput();
const cliRoute = new CliRoute('routes:list', 'List routes', cliHandler);
const outputFactory = (): OutputFactory => new OutputFactory(new CliInteractionConfig());

function textOf(output: CliOutputContract): string {
    return output
        .getMessages()
        .map((message) => message.getText())
        .join('');
}

describe('ListCommand', () => {
    it('lists routes including dynamic regexes', () => {
        const collection = new RouteCollection();
        collection.add(new Route('/users', 'users.index', httpHandler, [RequestMethod.GET]));
        collection.add(
            new DynamicRoute('/users/{id}', 'users.show', '/users/(\\d+)', [], httpHandler, [RequestMethod.GET]),
        );
        // A dynamic route with an unbuilt (empty) regex exercises the no-regex branch.
        collection.add(new DynamicRoute('/posts/{id}', 'posts.show', '', [], httpHandler, [RequestMethod.GET]));

        const output = new ListCommand(new CliConfig(), cliRoute, collection, outputFactory()).run();

        const text = textOf(output);
        expect(text).toContain('/users');
        expect(text).toContain('users.index');
        expect(text).toContain('Regex:');
    });

    it('returns an error when there are no routes', () => {
        const output = new ListCommand(new CliConfig(), cliRoute, new RouteCollection(), outputFactory()).run();

        expect(output.getExitCode()).toBe(ExitCode.ERROR);
        expect(textOf(output)).toContain('No routes were found');
    });

    it('exposes help text', () => {
        expect(ListCommand.help().getText()).toContain('routes');
    });
});

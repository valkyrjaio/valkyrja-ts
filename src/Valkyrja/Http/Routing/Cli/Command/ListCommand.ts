/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ExitCode } from '../../../../Cli/Interaction/Enum/ExitCode.ts';
import { TextColor } from '../../../../Cli/Interaction/Enum/TextColor.ts';
import { TextColorFormat } from '../../../../Cli/Interaction/Format/TextColorFormat.ts';
import { Formatter } from '../../../../Cli/Interaction/Formatter/Formatter.ts';
import { HighlightedTextFormatter } from '../../../../Cli/Interaction/Formatter/HighlightedTextFormatter.ts';
import { Banner } from '../../../../Cli/Interaction/Message/Banner.ts';
import { ErrorMessage } from '../../../../Cli/Interaction/Message/ErrorMessage.ts';
import { Header } from '../../../../Cli/Interaction/Message/Header.ts';
import { Message } from '../../../../Cli/Interaction/Message/Message.ts';
import { NewLine } from '../../../../Cli/Interaction/Message/NewLine.ts';
import { RequestMethod } from '../../../Message/Enum/RequestMethod.ts';

import type { CliConfigContract } from '../../../../Application/Data/Contract/CliConfigContract.ts';
import type { MessageContract } from '../../../../Cli/Interaction/Message/Contract/MessageContract.ts';
import type { OutputContract } from '../../../../Cli/Interaction/Output/Contract/OutputContract.ts';
import type { OutputFactoryContract } from '../../../../Cli/Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import type { RouteContract as CliRouteContract } from '../../../../Cli/Routing/Data/Contract/RouteContract.ts';
import type { DynamicRouteContract } from '../../Data/Contract/DynamicRouteContract.ts';
import type { RouteContract } from '../../Data/Contract/RouteContract.ts';
import type { RouteCollectionContract } from '../../Collection/Contract/RouteCollectionContract.ts';

export class ListCommand {
    constructor(
        protected config: CliConfigContract,
        protected cliRoute: CliRouteContract,
        protected collection: RouteCollectionContract,
        protected outputFactory: OutputFactoryContract,
    ) {}

    static help(): MessageContract {
        return new Message('A command to list all the routes present within the Http component.');
    }

    run(): OutputContract {
        const routes = Object.values(this.collection.getAll(RequestMethod.ANY));

        if (routes.length === 0) {
            return this.outputFactory
                .createOutput()
                .withExitCode(ExitCode.ERROR)
                .withAddedMessages(new Banner(new ErrorMessage('No routes were found')));
        }

        routes.sort((a, b) => a.getPath().localeCompare(b.getPath()));

        let output = this.outputFactory
            .createOutput()
            .withMessages(new Header(this.config.namespace, this.config.version, this.cliRoute))
            .withAddedMessages(new NewLine(), new Message('Routes:', new HighlightedTextFormatter()), new NewLine());

        for (const route of routes) {
            output = output.withAddedMessages(
                new Message('  '),
                new Message(route.getPath(), new Formatter(new TextColorFormat(TextColor.MAGENTA))),
                new NewLine(),
                new Message('    - '),
                new Message('Name: '),
                new Message(route.getName(), new HighlightedTextFormatter()),
                new NewLine(),
            );

            output = this.addDynamicRouteMessages(output, route);
        }

        return output.withAddedMessages(new NewLine());
    }

    protected addDynamicRouteMessages(output: OutputContract, route: RouteContract): OutputContract {
        if (!('getRegex' in route)) {
            return output;
        }

        const regex = (route as DynamicRouteContract).getRegex();

        if (regex === '') {
            return output;
        }

        return output.withAddedMessages(
            new Message('    - '),
            new Message('Regex: '),
            new Message(regex, new HighlightedTextFormatter()),
            new NewLine(),
        );
    }
}

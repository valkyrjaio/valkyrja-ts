import { ExitCode } from '../../../../Cli/Interaction/Enum/ExitCode.js';
import { TextColor } from '../../../../Cli/Interaction/Enum/TextColor.js';
import { TextColorFormat } from '../../../../Cli/Interaction/Format/TextColorFormat.js';
import { Formatter } from '../../../../Cli/Interaction/Formatter/Formatter.js';
import { HighlightedTextFormatter } from '../../../../Cli/Interaction/Formatter/HighlightedTextFormatter.js';
import { Banner } from '../../../../Cli/Interaction/Message/Banner.js';
import { ErrorMessage } from '../../../../Cli/Interaction/Message/ErrorMessage.js';
import { Header } from '../../../../Cli/Interaction/Message/Header.js';
import { Message } from '../../../../Cli/Interaction/Message/Message.js';
import { NewLine } from '../../../../Cli/Interaction/Message/NewLine.js';
import { RequestMethod } from '../../../Message/Enum/RequestMethod.js';

import type { CliConfigContract } from '../../../../Application/Data/Contract/CliConfigContract.js';
import type { MessageContract } from '../../../../Cli/Interaction/Message/Contract/MessageContract.js';
import type { OutputContract } from '../../../../Cli/Interaction/Output/Contract/OutputContract.js';
import type { OutputFactoryContract } from '../../../../Cli/Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import type { RouteContract as CliRouteContract } from '../../../../Cli/Routing/Data/Contract/RouteContract.js';
import type { DynamicRouteContract } from '../../Data/Contract/DynamicRouteContract.js';
import type { RouteContract } from '../../Data/Contract/RouteContract.js';
import type { RouteCollectionContract } from '../../Collection/Contract/RouteCollectionContract.js';

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

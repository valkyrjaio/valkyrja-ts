/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.ts';
import { ExitCode } from '../../Interaction/Enum/ExitCode.ts';
import { TextColor } from '../../Interaction/Enum/TextColor.ts';
import { TextColorFormat } from '../../Interaction/Format/TextColorFormat.ts';
import { Formatter } from '../../Interaction/Formatter/Formatter.ts';
import { HighlightedTextFormatter } from '../../Interaction/Formatter/HighlightedTextFormatter.ts';
import { Banner } from '../../Interaction/Message/Banner.ts';
import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.ts';
import { ErrorMessage } from '../../Interaction/Message/ErrorMessage.ts';
import { Header } from '../../Interaction/Message/Header.ts';
import { Message } from '../../Interaction/Message/Message.ts';
import { NewLine } from '../../Interaction/Message/NewLine.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import type { RouteCollectionContract } from '../../Routing/Collection/Contract/RouteCollectionContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';

export class ListCommand {
    constructor(
        protected config: CliConfigContract,
        protected route: RouteContract,
        protected collection: RouteCollectionContract,
        protected outputFactory: OutputFactoryContract,
    ) {}

    static help(): MessageContract {
        return new Message('A command to list all the commands present within the Cli component.');
    }

    run(): OutputContract {
        let namespace = '';
        let routes = Object.values(this.collection.all());

        if (this.route.hasOption('namespace')) {
            namespace = this.route.getOption('namespace').getFirstValue();
            routes = routes.filter((r) => r.getName().startsWith(namespace));
        }

        if (routes.length === 0) {
            return this.getNoRoutesErrorOutput(namespace);
        }

        routes.sort((a, b) => a.getName().localeCompare(b.getName()));

        let output = this.outputFactory
            .createOutput()
            .withMessages(new Header(this.config.namespace, this.config.version, this.route));

        output = this.addHeaderMessages(output, namespace);
        output = this.addRoutesMessages(output, routes);

        return output.withAddedMessages(new NewLine());
    }

    protected getNoRoutesErrorOutput(namespace: string): OutputContract {
        const errorMessage = namespace !== '' ? `Namespace \`${namespace}\` was not found.` : 'No routes found.';

        return this.outputFactory
            .createOutput()
            .withExitCode(ExitCode.ERROR)
            .withAddedMessages(new Banner(new ErrorMessage(errorMessage)));
    }

    protected addHeaderMessages(output: OutputContract, namespace: string): OutputContract {
        return output.withAddedMessages(
            new Message('Commands' + (namespace !== '' ? ` [${namespace}]:` : ':'), new HighlightedTextFormatter()),
            new NewLine(),
        );
    }

    protected addRoutesMessages(output: OutputContract, routes: RouteContract[]): OutputContract {
        for (const route of routes) {
            output = this.addRouteMessages(output, route);
        }

        return output;
    }

    protected addRouteMessages(output: OutputContract, route: RouteContract): OutputContract {
        return output.withAddedMessages(
            new Message('  '),
            new Message(route.getName(), new Formatter(new TextColorFormat(TextColor.MAGENTA))),
            new NewLine(),
            new Message('    - '),
            new Message(route.getDescription(), new HighlightedTextFormatter()),
            new NewLine(),
        );
    }
}

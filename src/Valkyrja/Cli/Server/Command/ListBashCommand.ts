/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.ts';
import { Message } from '../../Interaction/Message/Message.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import type { RouteCollectionContract } from '../../Routing/Collection/Contract/RouteCollectionContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';

export class ListBashCommand {
    constructor(
        protected route: RouteContract,
        protected collection: RouteCollectionContract,
        protected outputFactory: OutputFactoryContract,
    ) {}

    static help(): MessageContract {
        return new Message('A command to list all the commands present within the Cli component for bash completion.');
    }

    run(): OutputContract {
        const output = this.outputFactory.createOutput();
        let routes = Object.values(this.collection.all());
        let colonAt: number | false = false;

        const namespace = this.route.getArgumentValue('namespace');

        if (namespace !== '') {
            colonAt = namespace.indexOf(':');

            routes = routes.filter((r) => r.getName().startsWith(namespace));
        }

        const routesForBash = routes.map((r) => (colonAt !== false ? r.getName().substring(colonAt + 1) : r.getName()));

        return output.withAddedMessages(new Message(routesForBash.join(' ')));
    }
}

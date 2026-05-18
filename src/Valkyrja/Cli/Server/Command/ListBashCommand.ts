import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.js';
import { Message } from '../../Interaction/Message/Message.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import type { RouteCollectionContract } from '../../Routing/Collection/Contract/RouteCollectionContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';

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

        if (this.route.hasArgument('namespace')) {
            const namespace = this.route.getArgument('namespace').getFirstValue();
            colonAt = namespace.indexOf(':');

            routes = routes.filter((r) => r.getName().startsWith(namespace));
        }

        const routesForBash = routes.map((r) => (colonAt !== false ? r.getName().substring(colonAt + 1) : r.getName()));

        return output.withAddedMessages(new Message(routesForBash.join(' ')));
    }
}

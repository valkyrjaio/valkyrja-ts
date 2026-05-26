/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.js';
import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.js';
import { Header } from '../../Interaction/Message/Header.js';
import { Message } from '../../Interaction/Message/Message.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';

export class VersionCommand {
    constructor(
        protected outputFactory: OutputFactoryContract,
        protected config: CliConfigContract,
        protected route: RouteContract,
    ) {}

    static help(): MessageContract {
        return new Message('A command to show the application version and info.');
    }

    run(): OutputContract {
        return this.outputFactory
            .createOutput()
            .withMessages(new Header(this.config.namespace, this.config.version, this.route));
    }
}

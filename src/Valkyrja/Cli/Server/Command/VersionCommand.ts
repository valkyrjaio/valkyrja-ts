/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.ts';
import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.ts';
import { Header } from '../../Interaction/Message/Header.ts';
import { Message } from '../../Interaction/Message/Message.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';

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

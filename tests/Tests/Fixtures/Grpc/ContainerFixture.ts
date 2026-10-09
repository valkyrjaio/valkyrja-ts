/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Container } from '../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ContainerContract } from '../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';

/** Builds containers holding gRPC middleware doubles. */
export class ContainerFixture {
    static withMiddleware(...middleware: Array<new () => object>): ContainerContract {
        const container = new Container();

        for (const item of middleware) {
            container.setSingleton(item.name, new item());
        }

        return container;
    }
}

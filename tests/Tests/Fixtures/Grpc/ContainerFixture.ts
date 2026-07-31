/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Container } from '../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ContainerContract } from '../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';

/**
 * Builds containers holding gRPC middleware doubles.
 *
 * The stage handlers resolve middleware by constructor name, so each class is registered under
 * its own `name` — exactly as the framework's providers publish them.
 */
export class ContainerFixture {
    static withMiddleware(...middleware: Array<new () => object>): ContainerContract {
        const container = new Container();

        for (const item of middleware) {
            container.setSingleton(item.name, new item());
        }

        return container;
    }
}

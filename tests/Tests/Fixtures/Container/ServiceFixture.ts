/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ContainerContract } from '../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';

export class ServiceFixture {
    constructor(public readonly container: ContainerContract) {}

    static make(container: ContainerContract, _args: unknown[] = []): ServiceFixture {
        return new ServiceFixture(container);
    }

    getContainer(): ContainerContract {
        return this.container;
    }
}

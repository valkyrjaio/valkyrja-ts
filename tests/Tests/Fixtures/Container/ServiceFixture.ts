/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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

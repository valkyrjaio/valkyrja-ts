/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ContainerContract } from '../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';

export class SingletonFixture {
    static make(_container: ContainerContract, _args: unknown[] = []): SingletonFixture {
        return new SingletonFixture();
    }
}

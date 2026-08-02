/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ComponentContract } from '../Component/Contract/ComponentContract.ts';

export interface ValueContract {
    getComponents(): Array<ComponentContract | string>;
    withComponents(...components: Array<ComponentContract | string>): this;
    withAddedComponents(...components: Array<ComponentContract | string>): this;
    toString(): string;
}

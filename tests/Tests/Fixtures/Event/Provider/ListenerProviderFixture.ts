/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ListenerProviderContract } from '../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { ListenerContract } from '../../../../../src/Valkyrja/Event/Data/Contract/ListenerContract.ts';

export class ListenerProviderFixture implements ListenerProviderContract {
    getListeners(): ListenerContract[] {
        return [];
    }
}

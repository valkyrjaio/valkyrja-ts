/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Listener } from '../../../../../src/Valkyrja/Event/Data/Listener.ts';
import { EventFixture } from '../EventFixture.ts';

import type { ListenerProviderContract } from '../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { ListenerContract } from '../../../../../src/Valkyrja/Event/Data/Contract/ListenerContract.ts';

export class ListenerProviderFixture implements ListenerProviderContract {
    static readonly LISTENER_NAME = 'listener-from-provider-name' as const;

    getListeners(): ListenerContract[] {
        return [new Listener(EventFixture.EVENT_ID, ListenerProviderFixture.LISTENER_NAME, () => null)];
    }
}

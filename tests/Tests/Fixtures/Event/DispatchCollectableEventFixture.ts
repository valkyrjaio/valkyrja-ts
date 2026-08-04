/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { DispatchCollectableEventContract } from '../../../../src/Valkyrja/Event/Contract/DispatchCollectableEventContract.ts';

export class DispatchCollectableEventFixture implements DispatchCollectableEventContract {
    static readonly EVENT_ID = 'Valkyrja.Tests.Fixtures.Event.DispatchCollectableEventFixture' as const;

    protected dispatches: unknown[] = [];

    getEventId(): string {
        return DispatchCollectableEventFixture.EVENT_ID;
    }

    addDispatch(dispatch: unknown): void {
        this.dispatches.push(dispatch);
    }

    getDispatches(): unknown[] {
        return this.dispatches;
    }
}

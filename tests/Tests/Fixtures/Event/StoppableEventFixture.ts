/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { DispatchCollectableEventContract } from '../../../../src/Valkyrja/Event/Contract/DispatchCollectableEventContract.ts';
import type { StoppableEventContract } from '../../../../src/Valkyrja/Event/Contract/StoppableEventContract.ts';

export class StoppableEventFixture implements DispatchCollectableEventContract, StoppableEventContract {
    static readonly EVENT_ID = 'Valkyrja.Tests.Fixtures.Event.StoppableEventFixture' as const;

    protected dispatches: unknown[] = [];

    constructor(protected readonly propagationStopped: boolean = true) {}

    getEventId(): string {
        return StoppableEventFixture.EVENT_ID;
    }

    addDispatch(dispatch: unknown): void {
        this.dispatches.push(dispatch);
    }

    getDispatches(): unknown[] {
        return this.dispatches;
    }

    isPropagationStopped(): boolean {
        return this.propagationStopped;
    }
}

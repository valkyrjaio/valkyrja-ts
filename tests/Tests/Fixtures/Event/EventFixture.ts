/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { EventContract } from '../../../../src/Valkyrja/Event/Contract/EventContract.ts';

/**
 * Plain event used for unit testing.
 */
export class EventFixture implements EventContract {
    static readonly EVENT_ID = 'Valkyrja.Tests.Fixtures.Event.EventFixture' as const;

    getEventId(): string {
        return EventFixture.EVENT_ID;
    }
}

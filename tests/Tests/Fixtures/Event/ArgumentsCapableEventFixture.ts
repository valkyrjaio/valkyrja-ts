/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ArgumentsCapableEventContract } from '../../../../src/Valkyrja/Event/Contract/ArgumentsCapableEventContract.ts';

export class ArgumentsCapableEventFixture implements ArgumentsCapableEventContract {
    static readonly EVENT_ID = 'Valkyrja.Tests.Fixtures.Event.ArgumentsCapableEventFixture' as const;

    protected args: unknown[] = [];

    getEventId(): string {
        return ArgumentsCapableEventFixture.EVENT_ID;
    }

    setArguments(args: unknown[]): ArgumentsCapableEventContract {
        this.args = args;

        return this;
    }

    getArguments(): unknown[] {
        return this.args;
    }
}

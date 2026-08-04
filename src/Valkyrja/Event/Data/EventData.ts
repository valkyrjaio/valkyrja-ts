/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ListenerFactory } from './Contract/ListenerContract.ts';

export class EventData {
    /**
     * @param events    Each event identifier with the names of its listeners, in
     *                  the order that the collection recorded them
     * @param listeners A factory for each listener, keyed by the listener's name
     */
    constructor(
        public readonly events: Record<string, string[]> = {},
        public readonly listeners: Record<string, ListenerFactory> = {},
    ) {}
}

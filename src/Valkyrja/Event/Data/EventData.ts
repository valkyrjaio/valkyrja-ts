/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class EventData {
    constructor(
        public readonly events: Record<string, string[]> = {},
        public readonly listeners: Record<string, () => object> = {},
    ) {}
}

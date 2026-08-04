/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

/**
 * A thing that the dispatcher dispatches.
 *
 * The PHP port identifies an event by its class, and it reads `$event::class`.
 * TypeScript erases an interface, and it holds no class token that the string
 * binding keys can match, so an event states its own identifier. The collection
 * files a listener under that identifier, and the identifier takes the
 * binding-key format, `Valkyrja.{Component}.{Name}`. The Go port made the same
 * decision, for the same reason.
 */
export interface EventContract {
    /**
     * Get the identifier of the event.
     */
    getEventId(): string;
}

export namespace EventContract {
    export function instanceOf(value: unknown): value is EventContract {
        return typeof value === 'object' && value !== null && 'getEventId' in value;
    }
}

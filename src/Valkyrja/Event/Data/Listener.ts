/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ListenerContract, ListenerHandler } from './Contract/ListenerContract.ts';

export class Listener implements ListenerContract {
    constructor(
        protected readonly eventId: string,
        protected readonly name: string,
        protected readonly handler: ListenerHandler,
    ) {}

    getEventId(): string {
        return this.eventId;
    }

    withEventId(eventId: string): ListenerContract {
        return new Listener(eventId, this.name, this.handler);
    }

    getName(): string {
        return this.name;
    }

    withName(name: string): ListenerContract {
        return new Listener(this.eventId, name, this.handler);
    }

    getHandler(): ListenerHandler {
        return this.handler;
    }

    withHandler(handler: ListenerHandler): ListenerContract {
        return new Listener(this.eventId, this.name, handler);
    }
}

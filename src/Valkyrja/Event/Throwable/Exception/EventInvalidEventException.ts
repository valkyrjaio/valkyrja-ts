/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { EventInvalidArgumentException } from './Abstract/EventInvalidArgumentException.ts';

/**
 * Reports a binding key that the container resolves to something which is not
 * an event.
 *
 * The PHP port and the Java port build the event from its own class, so the
 * built value is an event by construction. TypeScript builds it through the
 * container, and the container resolves a binding key to any value at all. The
 * Go port declares the same exception, for the same reason.
 */
export class EventInvalidEventException extends EventInvalidArgumentException {
    constructor(
        public readonly id: string,
        options?: ErrorOptions,
    ) {
        super(`Service with \`${id}\` is not an event`, options);
        this.name = 'EventInvalidEventException';
    }
}

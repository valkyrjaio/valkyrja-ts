/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { EventInvalidArgumentException } from './Abstract/EventInvalidArgumentException.ts';

export class EventInvalidEventException extends EventInvalidArgumentException {
    constructor(
        public readonly id: string,
        options?: ErrorOptions,
    ) {
        super(`Service with \`${id}\` is not an event`, options);
        this.name = 'EventInvalidEventException';
    }
}

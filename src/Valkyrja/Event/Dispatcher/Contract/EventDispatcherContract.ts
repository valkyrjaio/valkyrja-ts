/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { EventContract } from '../../Contract/EventContract.ts';
import type { ListenerContract } from '../../Data/Contract/ListenerContract.ts';

export interface EventDispatcherContract {
    /**
     * Dispatch an event.
     */
    dispatch(event: EventContract): EventContract;

    /**
     * Dispatch an event if it has listeners.
     */
    dispatchIfHasListeners(event: EventContract): EventContract;

    /**
     * Build an event from the container and dispatch it.
     *
     * @param eventId The binding key of the event
     * @param args    The arguments to pass to the event
     */
    dispatchById(eventId: string, args?: unknown[]): EventContract;

    /**
     * Build an event from the container and dispatch it if it has listeners.
     *
     * @param eventId The binding key of the event
     * @param args    The arguments to pass to the event
     */
    dispatchByIdIfHasListeners(eventId: string, args?: unknown[]): EventContract;

    /**
     * Dispatch a set of listeners.
     */
    dispatchListeners(event: EventContract, ...listeners: ListenerContract[]): EventContract;

    /**
     * Dispatch a listener.
     */
    dispatchListener(event: EventContract, listener: ListenerContract): EventContract;
}

export namespace EventDispatcherContract {
    export function instanceOf(value: unknown): value is EventDispatcherContract {
        return typeof value === 'object' && value !== null && 'dispatchListeners' in value;
    }
}

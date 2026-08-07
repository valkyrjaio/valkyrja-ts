/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { EventContract } from '../../Contract/EventContract.ts';
import type { ListenerContract } from '../../Data/Contract/ListenerContract.ts';
import type { EventData } from '../../Data/EventData.ts';

export interface ListenerCollectionContract {
    /**
     * Get a data representation of the collection.
     */
    getData(): EventData;

    /**
     * Set data from a data object.
     */
    setFromData(data: EventData): void;

    /**
     * Determine if a listener is registered.
     */
    hasListener(listener: ListenerContract): boolean;

    /**
     * Determine if a listener is registered by its id.
     */
    hasListenerById(listenerId: string): boolean;

    /**
     * Add a listener.
     */
    addListener(listener: ListenerContract): void;

    /**
     * Remove a listener.
     */
    removeListener(listener: ListenerContract): void;

    /**
     * Remove a listener by id.
     */
    removeListenerById(listenerId: string): void;

    /**
     * Determine if listeners exist for a given event.
     */
    hasListenersForEvent(event: EventContract): boolean;

    /**
     * Determine if listeners exist for a given event id.
     */
    hasListenersForEventById(eventId: string): boolean;

    /**
     * Get all listeners for a given event, in the order that the collection
     * recorded them.
     */
    getListenersForEvent(event: EventContract): ListenerContract[];

    /**
     * Get all listeners for a given event id, in the order that the collection
     * recorded them.
     */
    getListenersForEventById(eventId: string): ListenerContract[];

    /**
     * Set listeners for a given event.
     */
    setListenersForEvent(event: EventContract, ...listeners: ListenerContract[]): void;

    /**
     * Set listeners for a given event id.
     */
    setListenersForEventById(eventId: string, ...listeners: ListenerContract[]): void;

    /**
     * Remove all listeners for a given event.
     */
    removeListenersForEvent(event: EventContract): void;

    /**
     * Remove all listeners for a given event id.
     */
    removeListenersForEventById(eventId: string): void;

    /**
     * Get all listeners.
     */
    getListeners(): ListenerContract[];

    /**
     * Get the id of every registered event that has listeners.
     */
    getEvents(): string[];

    /**
     * Get every registered event with its listeners.
     */
    getEventsWithListeners(): Record<string, ListenerContract[]>;
}

export namespace ListenerCollectionContract {
    export function instanceOf(value: unknown): value is ListenerCollectionContract {
        return typeof value === 'object' && value !== null && 'getListenersForEvent' in value;
    }
}

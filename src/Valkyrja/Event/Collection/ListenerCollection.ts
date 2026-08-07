/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { EventData } from '../Data/EventData.ts';

import type { EventContract } from '../Contract/EventContract.ts';
import type { ListenerContract, ListenerFactory } from '../Data/Contract/ListenerContract.ts';
import type { ListenerCollectionContract } from './Contract/ListenerCollectionContract.ts';

export class ListenerCollection implements ListenerCollectionContract {
    // A Map, not an object, because an object reorders a key that reads as an integer.
    protected events = new Map<string, string[]>();
    protected listeners = new Map<string, ListenerFactory>();

    getData(): EventData {
        const events: Record<string, string[]> = {};

        for (const [eventId, listenerIds] of this.events) {
            events[eventId] = [...listenerIds];
        }

        return new EventData(events, Object.fromEntries(this.listeners));
    }

    setFromData(data: EventData): void {
        this.events = new Map(
            Object.entries(data.events).map(([eventId, listenerIds]): [string, string[]] => [
                eventId,
                [...listenerIds],
            ]),
        );
        this.listeners = new Map(Object.entries(data.listeners));
    }

    hasListener(listener: ListenerContract): boolean {
        return this.hasListenerById(listener.getName());
    }

    hasListenerById(listenerId: string): boolean {
        return this.listeners.has(listenerId);
    }

    addListener(listener: ListenerContract): void {
        const listenerId = listener.getName();
        const eventId = listener.getEventId();

        let listenerIds = this.events.get(eventId);

        if (listenerIds === undefined) {
            listenerIds = [];

            this.events.set(eventId, listenerIds);
        }

        if (!listenerIds.includes(listenerId)) {
            listenerIds.push(listenerId);
        }

        this.listeners.set(listenerId, (): ListenerContract => listener);
    }

    removeListener(listener: ListenerContract): void {
        const listenerId = listener.getName();
        const listenerIds = this.events.get(listener.getEventId());

        if (listenerIds !== undefined) {
            this.removeValue(listenerIds, listenerId);
        }

        this.listeners.delete(listenerId);
    }

    removeListenerById(listenerId: string): void {
        for (const listenerIds of this.events.values()) {
            this.removeValue(listenerIds, listenerId);
        }

        this.listeners.delete(listenerId);
    }

    hasListenersForEvent(event: EventContract): boolean {
        return this.hasListenersForEventById(event.getEventId());
    }

    hasListenersForEventById(eventId: string): boolean {
        const listenerIds = this.events.get(eventId);

        return listenerIds !== undefined && listenerIds.length > 0;
    }

    getListenersForEvent(event: EventContract): ListenerContract[] {
        return this.getListenersForEventById(event.getEventId());
    }

    getListenersForEventById(eventId: string): ListenerContract[] {
        return this.getListenersByIds(this.events.get(eventId) ?? []);
    }

    setListenersForEvent(event: EventContract, ...listeners: ListenerContract[]): void {
        this.setListenersForEventById(event.getEventId(), ...listeners);
    }

    setListenersForEventById(eventId: string, ...listeners: ListenerContract[]): void {
        for (const listener of listeners) {
            this.addListener(listener.withEventId(eventId));
        }
    }

    removeListenersForEvent(event: EventContract): void {
        this.removeListenersForEventById(event.getEventId());
    }

    removeListenersForEventById(eventId: string): void {
        for (const listener of this.getListenersForEventById(eventId)) {
            this.removeListener(listener);
        }

        this.events.delete(eventId);
    }

    getListeners(): ListenerContract[] {
        return this.getListenersByIds(this.listeners.keys());
    }

    getEvents(): string[] {
        return [...this.events.keys()];
    }

    getEventsWithListeners(): Record<string, ListenerContract[]> {
        const eventsWithListeners: Record<string, ListenerContract[]> = {};

        for (const eventId of this.events.keys()) {
            eventsWithListeners[eventId] = this.getListenersForEventById(eventId);
        }

        return eventsWithListeners;
    }

    /**
     * Build each listener that the names identify.
     */
    protected getListenersByIds(listenerIds: Iterable<string>): ListenerContract[] {
        const listeners: ListenerContract[] = [];

        for (const listenerId of listenerIds) {
            const factory = this.listeners.get(listenerId);

            if (factory !== undefined) {
                listeners.push(factory());
            }
        }

        return listeners;
    }

    /**
     * Remove one name from an array of listener names, in place.
     */
    protected removeValue(listenerIds: string[], listenerId: string): void {
        const index = listenerIds.indexOf(listenerId);

        if (index !== -1) {
            listenerIds.splice(index, 1);
        }
    }
}

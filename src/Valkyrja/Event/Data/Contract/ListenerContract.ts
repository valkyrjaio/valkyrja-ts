/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';

/**
 * Runs one listener.
 *
 * The dispatcher passes the container and the arguments, and it files the
 * return value on an event that collects it. The arguments hold the event under
 * the `event` key.
 */
export type ListenerHandler = (container: ContainerContract, args: Record<string, unknown>) => unknown;

/**
 * Returns a listener.
 *
 * The collection holds one factory for each listener, so the generated cache
 * states how to build a listener rather than holding the listener itself.
 */
export type ListenerFactory = () => ListenerContract;

/**
 * One listener for one event.
 *
 * Each `with` method returns a copy and leaves the receiver unchanged.
 */
export interface ListenerContract {
    /**
     * Get the identifier of the event that the listener listens for.
     */
    getEventId(): string;

    /**
     * Create a new listener with the specified event identifier.
     *
     * @param eventId The event identifier
     */
    withEventId(eventId: string): ListenerContract;

    /**
     * Get the unique name. The collection files the listener under this name.
     */
    getName(): string;

    /**
     * Create a new listener with the specified unique name.
     *
     * @param name A unique name for the listener
     */
    withName(name: string): ListenerContract;

    /**
     * Get the handler.
     */
    getHandler(): ListenerHandler;

    /**
     * Create a new listener with the specified handler.
     *
     * @param handler The handler
     */
    withHandler(handler: ListenerHandler): ListenerContract;
}

export namespace ListenerContract {
    export function instanceOf(value: unknown): value is ListenerContract {
        return typeof value === 'object' && value !== null && 'getEventId' in value;
    }
}

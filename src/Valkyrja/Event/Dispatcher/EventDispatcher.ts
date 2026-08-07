/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Container } from '../../Container/Manager/Container.ts';
import { ArgumentsCapableEventContract } from '../Contract/ArgumentsCapableEventContract.ts';
import { DispatchCollectableEventContract } from '../Contract/DispatchCollectableEventContract.ts';
import { EventContract } from '../Contract/EventContract.ts';
import { StoppableEventContract } from '../Contract/StoppableEventContract.ts';
import { ListenerCollection } from '../Collection/ListenerCollection.ts';
import { EventInvalidEventException } from '../Throwable/Exception/EventInvalidEventException.ts';

import type { ContainerContract } from '../../Container/Manager/Contract/ContainerContract.ts';
import type { ListenerCollectionContract } from '../Collection/Contract/ListenerCollectionContract.ts';
import type { ListenerContract } from '../Data/Contract/ListenerContract.ts';
import type { EventDispatcherContract } from './Contract/EventDispatcherContract.ts';

const EVENT_ARGUMENT_KEY = 'event';

export class EventDispatcher implements EventDispatcherContract {
    constructor(
        protected readonly collection: ListenerCollectionContract = new ListenerCollection(),
        protected readonly container: ContainerContract = new Container(),
    ) {}

    dispatch(event: EventContract): EventContract {
        return this.dispatchListeners(event, ...this.collection.getListenersForEvent(event));
    }

    dispatchIfHasListeners(event: EventContract): EventContract {
        if (this.collection.hasListenersForEvent(event)) {
            return this.dispatch(event);
        }

        return event;
    }

    dispatchById(eventId: string, args: unknown[] = []): EventContract {
        return this.dispatch(this.getEventFromId(eventId, args));
    }

    dispatchByIdIfHasListeners(eventId: string, args: unknown[] = []): EventContract {
        if (this.collection.hasListenersForEventById(eventId)) {
            return this.dispatchById(eventId, args);
        }

        return this.getEventFromId(eventId, args);
    }

    dispatchListeners(event: EventContract, ...listeners: ListenerContract[]): EventContract {
        let dispatched = event;

        for (const listener of listeners) {
            dispatched = this.dispatchListener(dispatched, listener);

            if (StoppableEventContract.instanceOf(dispatched) && dispatched.isPropagationStopped()) {
                return dispatched;
            }
        }

        return dispatched;
    }

    dispatchListener(event: EventContract, listener: ListenerContract): EventContract {
        const handler = listener.getHandler();
        const dispatch = handler(this.container, { [EVENT_ARGUMENT_KEY]: event });

        if (DispatchCollectableEventContract.instanceOf(event)) {
            event.addDispatch(dispatch);
        }

        return event;
    }

    /**
     * Build the event that the binding key names.
     */
    protected getEventFromId(eventId: string, args: unknown[]): EventContract {
        const resolved: unknown = this.container.get(eventId, args);

        if (!EventContract.instanceOf(resolved)) {
            throw new EventInvalidEventException(eventId);
        }

        if (ArgumentsCapableEventContract.instanceOf(resolved)) {
            return resolved.setArguments(args);
        }

        return resolved;
    }
}

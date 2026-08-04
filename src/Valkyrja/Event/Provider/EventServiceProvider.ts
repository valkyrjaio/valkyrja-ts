/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ApplicationServiceId } from '../../Application/Constant/ApplicationServiceId.ts';
import { ListenerCollection } from '../Collection/ListenerCollection.ts';
import { EventServiceId } from '../Constant/EventServiceId.ts';
import { EventDispatcher } from '../Dispatcher/EventDispatcher.ts';

import type { ApplicationContract } from '../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { ListenerCollectionContract } from '../Collection/Contract/ListenerCollectionContract.ts';
import type { EventData } from '../Data/EventData.ts';

export class EventServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [EventServiceId.EventDispatcherContract]: EventServiceProvider.publishDispatcher,
            [EventServiceId.ListenerCollectionContract]: EventServiceProvider.publishListenerCollection,
            [EventServiceId.EventData]: EventServiceProvider.publishData,
        };
    }

    static publishDispatcher(this: void, container: ContainerContract): void {
        container.setSingleton(
            EventServiceId.EventDispatcherContract,
            new EventDispatcher(
                container.getSingleton<ListenerCollectionContract>(EventServiceId.ListenerCollectionContract),
                container,
            ),
        );
    }

    static publishListenerCollection(this: void, container: ContainerContract): void {
        const collection = new ListenerCollection();

        container.setSingleton(EventServiceId.ListenerCollectionContract, collection);

        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        if (app.getDebugMode()) {
            EventServiceProvider.publishData(container);

            return;
        }

        collection.setFromData(container.getSingleton<EventData>(EventServiceId.EventData));
    }

    static publishData(this: void, container: ContainerContract): void {
        const collection = container.getSingleton<ListenerCollectionContract>(
            EventServiceId.ListenerCollectionContract,
        );
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        for (const provider of app.getEventProviders()) {
            for (const listener of provider.getListeners()) {
                collection.addListener(listener);
            }
        }

        container.setSingleton(EventServiceId.EventData, collection.getData());
    }
}

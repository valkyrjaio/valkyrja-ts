# Event Dispatching

## Introduction

The Event component dispatches an event to the listeners that are registered for
it. An event is an object with an id. A listener is a data object that pairs an
event id with a handler function.

The component needs no reflection. A listener holds its handler directly, so the
dispatcher calls that function without a lookup.

## Core concepts

| Term       | Is                                                                 |
| :--------- | :----------------------------------------------------------------- |
| Event      | An object that implements `EventContract`                          |
| Event id   | The string that the collection files the listeners under           |
| Listener   | A `ListenerContract` that holds an event id, a name, and a handler |
| Handler    | The function that the dispatcher calls                             |
| Collection | The `ListenerCollectionContract` that holds every listener         |
| Dispatcher | The `EventDispatcherContract` that runs the listeners for an event |

## Defining an event

An event implements `EventContract`:

```ts
export interface EventContract {
    getEventId(): string;
}
```

Each contract in this component carries a type guard, because a TypeScript
interface erases at run time:

```ts
export namespace EventContract {
    export function instanceOf(value: unknown): value is EventContract {
        return typeof value === 'object' && value !== null && 'getEventId' in value;
    }
}
```

Use the guard instead of an `instanceof` test, and instead of an inline `in`
check.

### The three event capabilities

An event opts into more behavior by implementing one more contract.

`ArgumentsCapableEventContract` takes the arguments that the caller passed to
`dispatchById()`:

```ts
export interface ArgumentsCapableEventContract extends EventContract {
    setArguments(args: unknown[]): ArgumentsCapableEventContract;
}
```

`DispatchCollectableEventContract` collects what each listener returned:

```ts
export interface DispatchCollectableEventContract extends EventContract {
    addDispatch(dispatch: unknown): void;
    getDispatches(): unknown[];
}
```

`StoppableEventContract` stops the dispatcher before the next listener:

```ts
export interface StoppableEventContract extends EventContract {
    isPropagationStopped(): boolean;
}
```

Note that each guard tests one property. `ArgumentsCapableEventContract`
tests `setArguments`, `DispatchCollectableEventContract` tests `addDispatch`,
and `StoppableEventContract` tests `isPropagationStopped`.

## The listener

A listener holds three values:

```ts
export class Listener implements ListenerContract {
    constructor(
        protected readonly eventId: string,
        protected readonly name: string,
        protected readonly handler: ListenerHandler,
    ) {}
}
```

| Value     | Is                                                           |
| :-------- | :----------------------------------------------------------- |
| `eventId` | The event that the listener listens for                      |
| `name`    | The unique name that the collection files the listener under |
| `handler` | The function that the dispatcher calls                       |

Each `with…()` method returns a new `Listener`. The original does not change.

### The handler signature

```ts
export type ListenerHandler = (container: ContainerContract, args: Record<string, unknown>) => unknown;
```

The dispatcher passes the container and a record. The record holds the event
under the `event` key:

```ts
const listener = new Listener('app.user.registered', 'LogRegistration', (container, args) => {
    const event = args['event'] as UserRegistered;

    container.getSingleton<LoggerContract>(LoggerContractId).info(`Registered ${event.getEmail()}`);
});
```

The handler takes the container, so it resolves its own dependencies. See
[Container](../Container/README.md) for the resolution methods.

**This port has no listener decorator.** There is no attribute registration and
no class scan. A listener provider returns each listener as an object.

## Dispatching an event

`EventDispatcherContract` declares six methods:

```ts
export interface EventDispatcherContract {
    dispatch(event: EventContract): EventContract;
    dispatchIfHasListeners(event: EventContract): EventContract;
    dispatchById(eventId: string, args?: unknown[]): EventContract;
    dispatchByIdIfHasListeners(eventId: string, args?: unknown[]): EventContract;
    dispatchListeners(event: EventContract, ...listeners: ListenerContract[]): EventContract;
    dispatchListener(event: EventContract, listener: ListenerContract): EventContract;
}
```

`dispatch()` reads the listeners for the event and runs each one:

```ts
const dispatcher = container.getSingleton<EventDispatcherContract>(EventServiceId.EventDispatcherContract);

dispatcher.dispatch(new UserRegistered(user));
```

`dispatchIfHasListeners()` returns the event unchanged when no listener is
registered. Use it for an event that is expensive to dispatch.

### Dispatching by id

`dispatchById()` builds the event from the container, then dispatches it:

```ts
dispatcher.dispatchById('app.user.registered', [user]);
```

The dispatcher calls `container.get(eventId, args)`. The container must hold a
binding for that id.

Warning: `dispatchById()` throws `EventInvalidEventException` when the container
returns a value that is not an event. The message reads
``Service with `<id>` is not an event``.

The dispatcher passes the argument list on to the event, when the event accepts
one:

```ts
if (ArgumentsCapableEventContract.instanceOf(resolved)) {
    return resolved.setArguments(args);
}
```

### Stopping propagation

The dispatcher tests the event after each listener runs, and not before:

```ts
for (const listener of listeners) {
    dispatched = this.dispatchListener(dispatched, listener);

    if (StoppableEventContract.instanceOf(dispatched) && dispatched.isPropagationStopped()) {
        return dispatched;
    }
}
```

The first listener always runs. A listener stops the ones after it.

### Collecting return values

`dispatchListener()` calls the handler and stores what the handler returned,
when the event collects:

```ts
const handler = listener.getHandler();
const dispatch = handler(this.container, { event });

if (DispatchCollectableEventContract.instanceOf(event)) {
    event.addDispatch(dispatch);
}
```

Read the values with `getDispatches()` after the dispatch returns. The order
matches the order that the dispatcher ran the listeners in.

Note that `dispatchListener()` returns the event it received. A handler changes
the event through the event's own methods, and it does not return a replacement.

## The listener collection

`ListenerCollection` holds the listeners. It files each listener name under an
event id, and it holds a factory for each name.

| Method                      | Does                                           |
| :-------------------------- | :--------------------------------------------- |
| `addListener()`             | File the listener under its event id           |
| `removeListener()`          | Remove the listener from its event id          |
| `removeListenerById()`      | Remove the name from every event id            |
| `hasListener()`             | Is the listener's name registered              |
| `hasListenersForEvent()`    | Does the event id hold one listener or more    |
| `getListenersForEvent()`    | The listeners for the event, in order          |
| `setListenersForEvent()`    | Add each listener under the event id           |
| `removeListenersForEvent()` | Remove every listener, and remove the event id |
| `getListeners()`            | Every listener                                 |
| `getEvents()`               | Every event id                                 |
| `getEventsWithListeners()`  | Each event id with its listeners               |
| `getData()`                 | The collection state as an `EventData`         |
| `setFromData()`             | Replace the state from an `EventData`          |

Four of these take an event id instead of an event:
`hasListenersForEventById()`, `getListenersForEventById()`,
`setListenersForEventById()`, and `removeListenersForEventById()`.

Warning: `hasListenerById()` and `removeListenerById()` take a **listener** name,
and not an event id. Both key into the listener map. Every other method above
has no `…ById()` form.

Note that `addListener()` does not file the same name twice under one event id.
A second `addListener()` call with the same name replaces the factory, and the
name keeps its position in the order.

Note that the collection uses a `Map`, and not an object. An object reorders a
key that reads as an integer, and the listener order must not change.

## Event data

`EventData` is the transferable state of a collection:

```ts
export class EventData {
    constructor(
        public readonly events: Record<string, string[]> = {},
        public readonly listeners: Record<string, ListenerFactory> = {},
    ) {}
}
```

`events` maps an event id to its listener names, in order. `listeners` maps a
name to a factory:

```ts
export type ListenerFactory = () => ListenerContract;
```

## Registering listeners

A listener provider returns the listeners for one component:

```ts
export interface ListenerProviderContract {
    getListeners(): ListenerContract[];
}
```

The application returns each provider from `getEventProviders()`. See
[Application](../Application/README.md) for the provider hierarchy:

```ts
export class AppListenerProvider implements ListenerProviderContract {
    getListeners(): ListenerContract[] {
        return [new Listener('app.user.registered', 'LogRegistration', logRegistration)];
    }
}
```

### Adding a listener at run time

Resolve the collection and add the listener:

```ts
const collection = container.getSingleton<ListenerCollectionContract>(EventServiceId.ListenerCollectionContract);

collection.addListener(new Listener('app.user.registered', 'AuditRegistration', auditRegistration));
```

## Service registration

`EventServiceProvider` publishes three ids:

| Id                                          | Holds                        |
| :------------------------------------------ | :--------------------------- |
| `EventServiceId.EventDispatcherContract`    | An `EventDispatcher`         |
| `EventServiceId.ListenerCollectionContract` | A `ListenerCollection`       |
| `EventServiceId.EventData`                  | The collection's `EventData` |

The collection publisher reads the debug mode, and it takes one of two paths:

```ts
if (app.getDebugMode()) {
    EventServiceProvider.publishData(container);

    return;
}

collection.setFromData(container.getSingleton<EventData>(EventServiceId.EventData));
```

In debug mode the provider walks every listener provider and builds the data
again. Outside debug mode the provider loads the cached `EventData` from the
container.

`EventComponentProvider` returns the service provider, and it returns no
listener provider, no CLI route provider, and no HTTP route provider.

## Exceptions

| Class                        | Extends                         | Thrown when                                            |
| :--------------------------- | :------------------------------ | :----------------------------------------------------- |
| `EventInvalidEventException` | `EventInvalidArgumentException` | `dispatchById()` resolves a value that is not an event |

`EventInvalidEventException` keeps the id on a `readonly` property, so a caller
reads which id failed.

`EventRuntimeException` and `EventInvalidArgumentException` are the abstract
bases. Both implement `EventThrowable`. See
[Throwable](../Throwable/README.md) for the hierarchy.

# The Container

## Introduction

The Container is the framework's service locator. It maps a string id to a
factory, to an instance, or to another id. A service provider declares which
ids it can build, and the container runs that provider's callback the first time
something asks for one of those ids.

The container needs no reflection and no cache. A binding is an explicit
factory function, so the container builds a service the same way with a
generated data cache and without one.

## Binding keys are strings

A TypeScript interface erases at run time, so a contract cannot be a binding
key. Each component holds its keys in a `Constant/<Component>ServiceId.ts`
class:

```ts
export class ContainerServiceId {
    static readonly Contract = 'Valkyrja.Container.Manager.ContainerContract' as const;
    static readonly Data = 'Valkyrja.Container.Data.ContainerData' as const;
}
```

The key spells the source file's directory path the way the port writes an
import. The `Contract` segment drops out, because the class name ends in
`Contract` already.

## Contracts

`ContainerContract` extends `ProvidersAwareContract`:

```ts
export interface ProvidersAwareContract {
    register(provider: ServiceProviderContract): void;
    isDeferred(id: string): boolean;
    isPublished(id: string): boolean;
    publish(id: string): void;
}
```

```ts
export interface ContainerContract extends ProvidersAwareContract {
    getData(): ContainerData;
    setFromData(data: ContainerData): void;
    has(id: string): boolean;
    bind<T extends object>(id: string, factory: (container: ContainerContract, args?: unknown[]) => T): this;
    bindAlias(alias: string, id: string): this;
    bindSingleton<T extends object>(id: string, factory: (container: ContainerContract, args?: unknown[]) => T): this;
    setSingleton<T extends object>(id: string, singleton: T): this;
    isAlias(id: string): boolean;
    isService(id: string): boolean;
    isSingleton(id: string): boolean;
    isSingletonBinding(id: string): boolean;
    isSingletonInstance(id: string): boolean;
    get<T extends object>(id: string, args?: unknown[]): T;
    getAliased<T extends object>(id: string, args?: unknown[]): T;
    getService<T extends object>(id: string, args?: unknown[]): T;
    getSingleton<T extends object>(id: string): T;
}
```

Note that this port declares no `getAliasedId()`. The PHP reference declares
one.

## Service types

The container holds four maps, and each one answers a different question.

| Map          | Holds                         | Registered by     |
| :----------- | :---------------------------- | :---------------- |
| `services`   | A factory function            | `bind()`          |
| `singletons` | An id that resolves once      | `bindSingleton()` |
| `instances`  | A built object                | `setSingleton()`  |
| `aliases`    | Another id to resolve instead | `bindAlias()`     |

A fifth map, `deferredCallback`, holds the publish callback for each id a
registered provider declares. A sixth map, `published`, records each id the
container has already resolved or published.

## The factory signature

Every factory takes the container and an optional argument list:

```ts
(container: ContainerContract, args?: unknown[]) => T;
```

The container passes itself, so a factory resolves its own dependencies. The
`args` list carries the values a caller passed to `get()`.

## Binding services

### setSingleton()

`setSingleton()` stores an object that is already built. **Every provider in
this port registers with `setSingleton()`.** No framework code calls `bind()`,
`bindSingleton()`, or `bindAlias()`:

```ts
container.setSingleton(ApplicationServiceId.ApplicationContract, app);
```

Use it for a value the container cannot build, and for a service the provider
built already.

### bind()

`bind()` registers a factory. The container runs that factory on every
resolution, so each call returns a new object. An application binds its own
implementation this way:

```ts
import { LoggerContractId } from '@valkyrjaio/valkyrja/Log/Logger/Contract/LoggerContract.ts';

container.bind(LoggerContractId, () => new AppLogger());
```

`bind()` also marks the id as published, so a later `get()`, `getService()`, or
`getSingleton()` for that id does not run the provider's callback.
`publishUnpublishedProvided()` tests `isPublished()` first.

Warning: `publish()` itself does not test `isPublished()`. A direct `publish()`
call runs the provider's callback again, and that callback overwrites the
binding.

### bindSingleton()

`bindSingleton()` registers the same factory, and it records the id in the
`singletons` map. The container runs the factory once and stores the result:

```ts
container.bindSingleton(CliServerServiceId.InputHandlerContract, (container) => new InputHandler(container));
```

The second call returns the stored object. The container writes that object
into `instances` on the first resolution.

### bindAlias()

`bindAlias()` maps one id onto another. The first argument is the alias, and the
second argument is the id the container resolves instead:

```ts
container.bindAlias('App.Logger', LoggerContractId);
```

### Every service needs a binding

The container does not read a constructor and does not build an unregistered
class. `get()` throws `ContainerInvalidReferenceException` for an id that no map
holds:

```ts
throw new ContainerInvalidReferenceException(id); // Service with `<id>` not found
```

## Resolving services

### get()

`get()` publishes a deferred id, then tries each map in order:

1. A singleton — an instance, or a singleton binding.
2. A service — the factory runs.
3. An alias — the container resolves the target id.

```ts
const handler = container.get<RequestHandlerContract>(HttpServerServiceId.RequestHandlerContract);
```

### The specific methods

| Method           | Reads                        | Publishes a deferred id |
| :--------------- | :--------------------------- | :---------------------- |
| `getSingleton()` | An instance or a singleton   | Yes                     |
| `getService()`   | A factory                    | Yes                     |
| `getAliased()`   | An alias, then the target id | No                      |

Each one throws `ContainerInvalidReferenceException` when its own map holds
nothing for the id.

Prefer the specific method. It states what the code expects, and it fails where
the mistake is.

Warning: `getAliased()` does not publish a deferred id. It reads the alias map
directly, so an alias whose own provider has not published yet is missing, and
the method throws. The target resolves normally, because
`getAliasedWithoutChecks()` ends in `this.get()`.

### Passing arguments

`get()`, `getService()`, and `getAliased()` take an argument list. The container
passes it to the factory:

```ts
const logger = container.getService<LoggerContract>(LoggerContractId, ['debug']);
```

Note that no factory in this port reads `args`. Every framework provider
registers a built object with `setSingleton()`, so the argument list reaches an
application factory only.

`getSingleton()` takes no argument list. A singleton resolves once, so a second
argument list could not change the stored object.

## Inspecting the container

| Method                  | Answers                                                 |
| :---------------------- | :------------------------------------------------------ |
| `has()`                 | Is the id deferred, a singleton, a service, or an alias |
| `isAlias()`             | Does the `aliases` map hold the id                      |
| `isService()`           | Does the `services` map hold the id                     |
| `isSingleton()`         | Is the id a singleton binding or a built instance       |
| `isSingletonBinding()`  | Does the `singletons` map hold the id                   |
| `isSingletonInstance()` | Does the `instances` map hold the id                    |
| `isDeferred()`          | Does a provider declare a callback for the id           |
| `isPublished()`         | Has the container published or bound the id             |

`isSingleton()` returns `true` for either singleton state. Use
`isSingletonInstance()` to test whether the object exists already:

```ts
if (!container.isSingleton(ContainerServiceId.Data)) {
    ContainerServiceProvider.publishData(container);
}
```

## Service providers

A service provider declares one callback for each id it builds:

```ts
export interface ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void>;
}
```

The contract carries a type guard, because an interface erases at run time:

```ts
export namespace ServiceProviderContract {
    export function instanceOf(value: unknown): value is ServiceProviderContract {
        return typeof value === 'object' && value !== null && 'publishers' in value;
    }
}
```

`register()` reads the map and stores each callback as a deferred id:

```ts
container.register(new ContainerServiceProvider());
```

Warning: `register()` throws `ContainerInvalidPublishCallbackException` when a
value in the map is not a function.

### Deferred publication

Nothing runs at registration. The container runs a callback the first time
`get()`, `getService()`, or `getSingleton()` asks for that id:

```ts
protected publishUnpublishedProvided(id: string): void {
    if (this.isDeferred(id) && !this.isPublished(id)) {
        this.publish(id);
    }
}
```

`publish()` returns without an error for an id that no provider declares.

A publisher is a static method, and it takes `this: void`, so the container
calls it as a plain function:

```ts
export class ContainerServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ContainerServiceId.Data]: ContainerServiceProvider.publishData,
        };
    }

    static publishData(this: void, container: ContainerContract): void {
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        for (const provider of app.getContainerProviders()) {
            container.register(provider);
        }

        container.setSingleton(ContainerServiceId.Data, container.getData());
    }
}
```

### Wiring a provider into the application

A component provider returns the service providers for its component. See
[Application](../Application/README.md) for the full provider hierarchy:

```ts
export class ContainerComponentProvider implements ComponentProviderContract {
    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new ContainerServiceProvider()];
    }
}
```

## Container data

`ContainerData` is the transferable state of a container. Every property is
`readonly`:

```ts
export class ContainerData {
    readonly aliases: Record<string, string>;
    readonly deferredCallback: Record<string, (container: ContainerContract) => void>;
    readonly services: Record<string, (container: ContainerContract, args?: unknown[]) => object>;
    readonly singletons: Record<string, string>;
}
```

Note that `ContainerData` carries no `instances` map. A built object does not
transfer.

`getData()` returns a copy of the four maps. `setFromData()` merges a data
object into the container, so an existing key keeps the incoming value:

```ts
this.aliases = { ...this.aliases, ...data.aliases };
```

The `Container` constructor also takes a `ContainerData`, and it replaces the
four maps instead of merging.

## Child containers

A child container is a per-request container. `WorkerHttp` builds one for each
request, so request state never reaches the long-lived parent:

```ts
static getChildContainer(app: ApplicationContract, data: ContainerData): ContainerContract {
    return new ChildContainer(app.getContainer(), data);
}
```

### What the child copies

The `ChildContainer` constructor copies two maps from the data. It copies the
singleton bindings and the deferred callbacks:

```ts
constructor(
    protected parent: ContainerContract,
    data: ContainerData,
) {
    super();

    this.singletons = { ...data.singletons };
    this.deferredCallback = { ...data.deferredCallback };
}
```

Note that the child copies no service factory and no alias. The child reaches
each of those through the parent.

### Resolution order

The child answers from its own maps first. It reads the parent only when its own
map holds nothing:

```ts
protected override getServiceWithoutChecks<T extends object>(id: string, args: unknown[] = []): T | undefined {
    if (!super.isService(id) && this.parent.isService(id)) {
        return this.parent.getService<T>(id, args);
    }

    return super.getServiceWithoutChecks<T>(id, args);
}
```

`isAlias()`, `isService()`, `isSingletonInstance()`, `isDeferred()`, and
`isPublished()` each report the child state or the parent state.

Warning: `isSingletonBinding()` is not overridden. The child reports its own
copied bindings, and it does not report a binding that the parent added after
`getData()` ran.

### Where a singleton instance lives

A singleton binding that the child copied resolves once for each child. The
child asks the parent to run the factory, and the child stores the result in its
own `instances` map. The parent's map does not change.

An instance the parent built before the request loop is shared. The child
returns the parent's object:

```ts
protected override getSingletonWithoutChecks<T extends object>(id: string): T | undefined {
    if (!super.isSingletonInstance(id) && this.parent.isSingletonInstance(id)) {
        return this.parent.getSingleton<T>(id);
    }

    return super.getSingletonWithoutChecks<T>(id);
}
```

`WorkerHttp.bootstrapParentServices()` uses that rule. It resolves the route
collection once in the parent, so every child reads one collection:

```ts
static bootstrapParentServices(app: ApplicationContract): void {
    app.getContainer().getSingleton<RouteCollectionContract>(HttpRoutingServiceId.RouteCollectionContract);
}
```

Note that this port declares no guard against a parent that writes while it
answers a child. The PHP reference throws
`ContainerUnpublishedParentTargetException` and
`ContainerUnresolvedParentAliasException`. This port has neither exception, and
the child delegates to the parent in every case above.

## Exceptions

| Class                                      | Extends                             | Thrown when                              |
| :----------------------------------------- | :---------------------------------- | :--------------------------------------- |
| `ContainerInvalidReferenceException`       | `ContainerInvalidArgumentException` | No map holds the id                      |
| `ContainerInvalidPublishCallbackException` | `ContainerRuntimeException`         | A `publishers()` value is not a function |

`ContainerRuntimeException` and `ContainerInvalidArgumentException` are the
abstract bases. Both implement `ContainerThrowable`. See
[Throwable](../Throwable/README.md) for the hierarchy.

## Container bindings

| Id                            | Holds                           | Published by               |
| :---------------------------- | :------------------------------ | :------------------------- |
| `ContainerServiceId.Contract` | The container itself            | The entry point, at boot   |
| `ContainerServiceId.Data`     | The container's `ContainerData` | `ContainerServiceProvider` |

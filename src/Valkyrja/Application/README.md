# The Application

## Introduction

The Application component boots the framework. An entry class takes a config
object, builds the container, registers every provider, and hands control to a
protocol handler.

The application holds no service itself. It holds the config, the container, and
the provider tree. See [Container](../Container/README.md) for the container.

## Entry points

The component ships three entry classes over one abstract base:

| Class        | Runtime                           | Boots             |
| :----------- | :-------------------------------- | :---------------- |
| `Http`       | Node `http`, one boot per request | On each request   |
| `WorkerHttp` | Node `http`, persistent           | Once, at startup  |
| `Cli`        | A command-line process            | Once, per process |
| `App`        | The abstract base                 | —                 |

**This port ships no OpenSwoole, RoadRunner, or FrankenPHP entry.** The PHP
reference ships all three.

### HTTP

`Http.run()` opens a server and boots the application for each request:

```ts
import { Http } from '@valkyrjaio/valkyrja/Application/Entry/Http.ts';

Http.run(new HttpConfig(), 3000);
```

Warning: `Http.handle()` calls `start()` on every request, so every request pays
the full boot cost. Use `WorkerHttp` for a process that serves more than one
request.

### CLI

`Cli.run()` boots once and runs the input handler:

```ts
import { Cli } from '@valkyrjaio/valkyrja/Application/Entry/Cli.ts';

Cli.run(new CliConfig());
```

`Cli.getInput()` drops the first element of `process.argv`, because that element
is the interpreter path. The factory expects the vector to start with the
caller. See [Cli](../Cli/README.md) for the command-line syntax.

### The persistent worker

`WorkerHttp.run()` boots once, captures the container data, and builds a child
container for each request:

```ts
static handle(
    app: ApplicationContract,
    data: ContainerData,
    nodeRequest: IncomingMessage,
    nodeResponse: ServerResponse,
): void {
    const request = this.getRequest(nodeRequest);
    const childContainer = this.getChildContainer(app, data);
    const childApp = this.getChildApplication(app, childContainer);

    this.bootstrapChildContainer(childApp, childContainer);
    this.handleRequest(childContainer, request, nodeResponse);
}
```

The child container keeps request state out of the parent. See
[Container](../Container/README.md) for the resolution order and for what the
child copies.

`bootstrapParentServices()` resolves the route collection once in the parent, so
every child reads one collection.

### Customizing an entry class

Every method on `App` is `static`, and a subclass overrides the one it needs:

```ts
export class AppHttp extends Http {
    static override getThrowableHandler(): ThrowableHandlerContract {
        return new AppThrowableHandler();
    }
}
```

`createServer()` and `listen()` are runtime seams. A test substitutes a double
for each one, so no test opens a socket.

## Configuration

The application config is a class, and not a file. `ConfigContract` declares the
base properties:

```ts
export interface ConfigContract {
    readonly namespace: string;
    readonly dir: string;
    readonly version: string;
    readonly environment: string;
    readonly debugMode: boolean;
    readonly timezone: string;
    readonly key: string;
    readonly dataPath: string;
    readonly dataNamespace: string;
    readonly providers: ComponentProviderContract[];
    readonly callbacks: ((app: ApplicationContract) => void)[];
}
```

### Base properties

| Property        | Default                   | Holds                                       |
| :-------------- | :------------------------ | :------------------------------------------ |
| `namespace`     | `'App'`                   | The application's own namespace             |
| `dir`           | `process.cwd()`           | The base directory                          |
| `version`       | `ApplicationInfo.VERSION` | The framework version                       |
| `environment`   | `'production'`            | The environment name                        |
| `debugMode`     | `false`                   | Rebuild the data, and enable the handler    |
| `timezone`      | `'UTC'`                   | The value written to `process.env.TZ`       |
| `key`           | `'some_secret_app_key'`   | The application key                         |
| `dataPath`      | `'App/Provider/Data'`     | Where the generated data lives              |
| `dataNamespace` | `'App/Provider/Data'`     | The namespace of the generated data         |
| `providers`     | One component provider    | The root of the provider tree               |
| `callbacks`     | `[]`                      | Functions the application runs at bootstrap |

Warning: `key` has a default, and that default is not a secret. Set it in the
application config.

### The three config classes

| Class        | Implements           | Default root provider                     |
| :----------- | :------------------- | :---------------------------------------- |
| `Config`     | `ConfigContract`     | `ApplicationComponentProvider`            |
| `HttpConfig` | `HttpConfigContract` | `HttpApplicationComponentProvider`        |
| `CliConfig`  | `CliConfigContract`  | `CliWithHttpApplicationComponentProvider` |

`HttpConfig` and `CliConfig` each add the middleware lists for their protocol.
Each list holds binding keys, and not classes:

```ts
export interface HttpConfigContract extends ConfigContract {
    readonly requestReceivedMiddleware: string[];
    readonly routeMatchedMiddleware: string[];
    readonly routeNotMatchedMiddleware: string[];
    readonly routeDispatchedMiddleware: string[];
    readonly throwableCaughtMiddleware: string[];
    readonly sendingResponseMiddleware: string[];
    readonly responseSentMiddleware: string[];
}
```

`CliConfigContract` adds `applicationName`, `defaultCommandName`, and its own
six lists. `CliConfig` ships a default for three of them:

| List                        | Default                                                                |
| :-------------------------- | :--------------------------------------------------------------------- |
| `inputReceivedMiddleware`   | The help, version, and global interaction option middleware            |
| `routeNotMatchedMiddleware` | `CheckCommandForTypoMiddleware`                                        |
| `throwableCaughtMiddleware` | `LogThrowableCaughtMiddleware`, then `OutputThrowableCaughtMiddleware` |

`HttpConfig` ships an empty list for each of its seven. See
[Http](../Http/README.md) and [Cli](../Cli/README.md) for what each stage does.

### Your own config class

Extend a config class, or implement the contract:

```ts
export class AppConfig extends HttpConfig {
    constructor() {
        super('App', process.cwd(), ApplicationInfo.VERSION, 'local', true);
    }
}
```

Note that `HttpConfig` and `CliConfig` each carry a `static readonly id`. The
bootstrap reads that property and registers the config under it as well:

```ts
const concreteConfigId = (config.constructor as { id?: string }).id;

if (concreteConfigId !== undefined && concreteConfigId !== ApplicationServiceId.Config) {
    container.setSingleton(concreteConfigId, config);
}
```

`Config` declares no `id`, so a plain `Config` registers under the two base keys
only.

**This port reads no environment file.** There is no `env()` helper and no
`.env` loader. The one environment write is the timezone:

```ts
protected bootstrapTimezone(): void {
    process.env['TZ'] = this.config.timezone;
}
```

### Config callbacks

The application runs each callback during bootstrap, after it registers the
config and the container:

```ts
publishProviderCallbacks(): void {
    for (const callback of this.config.callbacks) {
        callback(this);
    }
}
```

A callback takes the application, so it reaches the container through
`getContainer()`.

## The bootstrap sequence

`App.start()` runs four steps:

```ts
static start(config: ConfigContract): ApplicationContract {
    if (config.debugMode) {
        this.defaultExceptionHandler();
    }

    this.appStart();
    this.directory(config.dir);

    return this.app(config);
}
```

1. **The debug handler.** `defaultExceptionHandler()` runs in debug mode. The
   base method does nothing, and a subclass overrides it.
2. **The start time.** `appStart()` records `performance.now()` once. A second
   call keeps the first value.
3. **The base directory.** `directory()` writes `config.dir` to
   `Directory.basePath`.
4. **The application.** `app()` builds the container, builds the `Valkyrja`
   application, and registers the services.

`bootstrapServices()` then does the rest:

1. Register the config under `ConfigContract`, under `Config`, and under the
   concrete id.
2. Register the container under `ContainerServiceId.Contract`.
3. Register the application under `ApplicationServiceId.ApplicationContract`.
4. Run the config callbacks.
5. Load the container data.

`loadContainerData()` publishes the data when the container does not hold it
already, then merges it:

```ts
static loadContainerData(container: ContainerContract): void {
    if (!container.isSingleton(ContainerServiceId.Data)) {
        this.publishContainerData(container);
    }

    const containerData = container.getSingleton<ContainerData>(ContainerServiceId.Data);

    container.setFromData(containerData);
}
```

## The application

`ApplicationContract` declares ten methods:

```ts
export interface ApplicationContract {
    getContainer(): ContainerContract;
    publishProviderCallbacks(): void;
    getProviders(): ComponentProviderContract[];
    getContainerProviders(): ServiceProviderContract[];
    getEventProviders(): ListenerProviderContract[];
    getCliProviders(): CliRouteProviderContract[];
    getHttpProviders(): HttpRouteProviderContract[];
    getDebugMode(): boolean;
    getEnvironment(): string;
    getVersion(): string;
}
```

`Valkyrja` is the implementation. It caches each provider list after the first
call, so a second call does no work.

`ChildApplication` wraps a parent and one container. Every method delegates to
the parent, and `getContainer()` returns the child container.

## The provider hierarchy

A component provider names the providers for one component:

```ts
export interface ComponentProviderContract {
    getComponentProviders(app: ApplicationContract): ComponentProviderContract[];
    getContainerProviders(app: ApplicationContract): ServiceProviderContract[];
    getEventProviders(app: ApplicationContract): ListenerProviderContract[];
    getCliProviders(app: ApplicationContract): CliRouteProviderContract[];
    getHttpProviders(app: ApplicationContract): HttpRouteProviderContract[];
}
```

| Method                    | Returns                                                        |
| :------------------------ | :------------------------------------------------------------- |
| `getComponentProviders()` | The component providers this one depends on                    |
| `getContainerProviders()` | The service providers, see [Container](../Container/README.md) |
| `getEventProviders()`     | The listener providers, see [Event](../Event/README.md)        |
| `getCliProviders()`       | The CLI route providers, see [Cli](../Cli/README.md)           |
| `getHttpProviders()`      | The HTTP route providers, see [Http](../Http/README.md)        |

### Loading order

`getProviders()` walks the tree depth first. A child provider lands in the list
before its parent:

```ts
protected collectProviders(provider: ComponentProviderContract): void {
    for (const subProvider of provider.getComponentProviders(this)) {
        this.collectProviders(subProvider);
    }

    this.providers.push(provider);
}
```

A component that another component depends on therefore registers first.

Each of the four typed lists is flattened and deduplicated:

```ts
this.serviceProviders = [...new Set(providers.flat())];
```

Warning: the `Set` removes a duplicate object reference, and it does not remove
two separate instances of one provider class. Two providers that each return
`new ContainerComponentProvider()` produce two entries.

### The built-in component providers

| Class                                     | Returns                                                                                 |
| :---------------------------------------- | :-------------------------------------------------------------------------------------- |
| `ApplicationComponentProvider`            | Container and Event                                                                     |
| `HttpApplicationComponentProvider`        | Container, and the HTTP message, middleware, routing, routing CLI, and server providers |
| `CliApplicationComponentProvider`         | Container and the four CLI components                                                   |
| `CliWithHttpApplicationComponentProvider` | The CLI set, and the HTTP routing CLI provider                                          |

Each of the last three extends `ApplicationComponentProvider` and overrides
`getComponentProviders()`.

Note that `PublishableComponentProviderContract` is declared, and nothing in
this port implements or reads it.

### Writing a component provider

Return the providers for your component, and return an empty array for each kind
your component does not use:

```ts
export class AppComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new HttpApplicationComponentProvider()];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new AppServiceProvider()];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [];
    }
}
```

## Directories

`Directory` holds a static path segment for each directory, and a method that
joins it onto the base path:

```ts
Directory.basePath = config.dir;

Directory.storageDirectory('logs/app.log');
```

| Method                             | Reads                     |
| :--------------------------------- | :------------------------ |
| `baseDirectory()`                  | `basePath`                |
| `appDirectory()`                   | `app`                     |
| `dataDirectory()`                  | `data`                    |
| `envDirectory()`                   | `env`                     |
| `publicDirectory()`                | `public`                  |
| `resourcesDirectory()`             | `resources`               |
| `srcDirectory()`                   | `src`                     |
| `storageDirectory()`               | `storage`                 |
| `frameworkStorageDirectory()`      | `storage/framework`       |
| `frameworkStorageCacheDirectory()` | `storage/framework/cache` |
| `logsStorageDirectory()`           | `storage/logs`            |
| `testsDirectory()`                 | `tests`                   |
| `vendorDirectory()`                | `node_modules`            |

Each static segment is writable, so an application changes one at bootstrap.
`path()` adds a leading `/` when the argument does not start with one.

Note that `vendorPath` is `node_modules`, and the PHP reference uses `vendor`.

## Framework information

`ApplicationInfo` holds four constants:

| Constant                  | Holds                                   |
| :------------------------ | :-------------------------------------- |
| `VERSION`                 | The released version of the framework   |
| `VERSION_BUILD_DATE_TIME` | When the release job built that version |
| `ASCII`                   | The Valkyrja word mark, as ASCII art    |
| `ICON`                    | The Valkyrja icon, as block characters  |

The release job rewrites `VERSION` and `VERSION_BUILD_DATE_TIME`. Read
`getVersion()` on the application instead of the constant, because the config
holds the version the application runs under.

## Debug mode

`debugMode` changes three things:

- `App.start()` calls `defaultExceptionHandler()`.
- The entry point registers a throwable handler. See
  [Throwable](../Throwable/README.md).
- `EventServiceProvider` rebuilds the listener data from the providers, instead
  of loading the cached data. See [Event](../Event/README.md).

Warning: keep `debugMode` false in production. A debug boot walks every provider
on each start.

## Container bindings

| Id                                         | Holds                      |
| :----------------------------------------- | :------------------------- |
| `ApplicationServiceId.ApplicationContract` | The application            |
| `ApplicationServiceId.ConfigContract`      | The config                 |
| `ApplicationServiceId.Config`              | The config                 |
| `ApplicationServiceId.HttpConfigContract`  | An `HttpConfig`, when used |
| `ApplicationServiceId.CliConfigContract`   | A `CliConfig`, when used   |

The entry point registers each of these directly. No service provider publishes
them.

## Exceptions

`ApplicationRuntimeException` and `ApplicationInvalidArgumentException` are the
abstract bases. Both implement `ApplicationThrowable`. This port declares no
concrete application exception. See [Throwable](../Throwable/README.md) for the
hierarchy.

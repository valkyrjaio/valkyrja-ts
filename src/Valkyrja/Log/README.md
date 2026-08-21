# Log

## Introduction

The Log component declares the logging contract. The component holds one file,
`Logger/Contract/LoggerContract.ts`.

**The framework ships no logger.** The port has no PSR-3 equivalent, no adapter,
and no null implementation. An application binds its own implementation to the
logger binding key. The framework then resolves that implementation where it
logs.

## The LoggerContract contract

The contract declares one method for each log level, and one method for a
throwable:

```ts
export interface LoggerContract {
    throwable(throwable: Error, message: string): void;
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    notice(message: string, context?: Record<string, unknown>): void;
    warning(message: string, context?: Record<string, unknown>): void;
    error(message: string, context?: Record<string, unknown>): void;
    critical(message: string, context?: Record<string, unknown>): void;
    alert(message: string, context?: Record<string, unknown>): void;
    emergency(message: string, context?: Record<string, unknown>): void;
}
```

`throwable()` records an exception together with a message. Call it where the
code catches a throwable. Each level method takes an optional context record.

Note that `throwable()` takes no context parameter in this port, and the port
declares no general `log(level, message)` method. The port also declares no log
level enum. The level is the method name.

## Container binding

The binding key sits in the contract file, next to the contract:

```ts
export const LoggerContractId = 'Valkyrja.Log.Logger.LoggerContract' as const;
```

Note that this key is a `const` export, and not a member of a `Constant/` class.
Every other component holds its keys in a `Constant/<Component>ServiceId.ts`
class. See [Container](../Container/README.md) for the usual shape.

**No service provider publishes this binding.** The application registers the
implementation itself, in its own service provider or at bootstrap:

```ts
import { LoggerContractId } from '@valkyrjaio/valkyrja/Log/Logger/Contract/LoggerContract.ts';

container.setSingleton(LoggerContractId, new AppLogger());
```

Warning: `CliServerServiceProvider` resolves this binding to build
`LogThrowableCaughtMiddleware`. The resolution fails when the application binds
no logger. Bind the logger before the CLI server publishes that middleware.

## What the framework logs

Three classes take a `LoggerContract` through the constructor.

| Class                                        | Component                          | What it logs                                     |
| :------------------------------------------- | :--------------------------------- | :----------------------------------------------- |
| `LogThrowableCaughtMiddleware` (HTTP)         | [Http](../Http/README.md)          | A caught throwable, with the request path        |
| `LogThrowableCaughtMiddleware` (CLI)          | [Cli](../Cli/README.md)            | A caught throwable                               |
| `LogClient`                                   | [Http](../Http/README.md)          | An outgoing request, at the `info` level         |

The HTTP middleware calls `throwable()` with the request path in the message:

```ts
const url = request.getUri().getPath();
const logMessage = `Http Server Error\nUrl: ${url}`;

this.logger.throwable(throwable, logMessage);
```

`LogClient` implements the HTTP `ClientContract`. It logs the request and
returns an `EmptyResponse`, so it sends nothing. Use it in a test, or in an
environment that must not make an outgoing request.

Note that no provider publishes the HTTP `LogThrowableCaughtMiddleware` or
`LogClient`. The application constructs each one with its own logger.

# Throwable

## Introduction

The Throwable component holds the root of the framework's exception hierarchy.
It declares one contract that adds a trace code to the native `Error`, two
abstract exception bases that every component extends, and the contract for a
global throwable handler.

Every other component derives its own exceptions from this component. See
[Container](../Container/README.md), [Http](../Http/README.md), and
[Cli](../Cli/README.md) for the exceptions each one throws.

## The ValkyrjaThrowable contract

`ValkyrjaThrowable` extends the native `Error` and adds one method:

```ts
export interface ValkyrjaThrowable extends Error {
    getTraceCode(): string;
}
```

An application imports the contract with the `.ts` extension:

```ts
import { type ValkyrjaThrowable } from '@valkyrjaio/valkyrja/Throwable/Contract/ValkyrjaThrowable.ts';
```

A trace code is a deterministic identifier for a failure point. A log entry
carries the trace code, and a reader correlates the log entry to the failure
without an exposed stack trace.

The contract is an interface, so it erases at run time. TypeScript cannot test
an interface with `instanceof`. Test for a concrete class instead, or test for
the abstract base that the class extends.

## The abstract exception bases

The component ships two abstract classes in `Exception/Abstract/`. Both extend
the native `Error` and implement `ValkyrjaThrowable`:

- `ValkyrjaRuntimeException` — the base for a failure that arises at run time.
- `ValkyrjaInvalidArgumentException` — the base for an invalid argument.

Each one implements `getTraceCode()` through the handler:

```ts
export abstract class ValkyrjaRuntimeException extends Error implements ValkyrjaThrowable {
    getTraceCode(): string {
        return ThrowableHandler.getTraceCode(this);
    }
}
```

Note that this port declares no `ValkyrjaThrowable` exception class, no
`TypeError`, and no concrete exception at the root. The two abstract classes
above are the full set. A concrete exception belongs to the component that
throws it.

## How a component extends the hierarchy

A component declares a throwable contract, two abstract bases, and its concrete
exceptions. The names prepend the component name, because one generated data
file references classes from many components at once.

The component's throwable contract is a type alias of `ValkyrjaThrowable`:

```ts
import { type ValkyrjaThrowable } from '../../../Throwable/Contract/ValkyrjaThrowable.ts';

export type ContainerThrowable = ValkyrjaThrowable;
```

The component's abstract bases extend the framework bases and implement the
component contract:

```ts
import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.ts';

import { type ContainerThrowable } from '../../Contract/ContainerThrowable.ts';

export abstract class ContainerRuntimeException extends ValkyrjaRuntimeException implements ContainerThrowable {}
```

A concrete exception extends one of the component bases. The constructor builds
the message and sets `this.name`. The native `Error` does not set `name` from
the class, so a class that omits the assignment reports `Error`:

```ts
import { ContainerInvalidArgumentException } from './Abstract/ContainerInvalidArgumentException.ts';

export class ContainerInvalidReferenceException extends ContainerInvalidArgumentException {
    constructor(id: string, options?: ErrorOptions) {
        super(`Service with \`${id}\` not found`, options);
        this.name = 'ContainerInvalidReferenceException';
    }
}
```

Every component ships both abstract bases, even when nothing extends one of them
yet.

## The throwable handler

`ThrowableHandlerContract` declares one method:

```ts
export interface ThrowableHandlerContract {
    enable(options?: { displayErrors?: boolean }): void;
}
```

The contract also carries a type guard, because an interface erases at run time:

```ts
export namespace ThrowableHandlerContract {
    export function instanceOf(value: unknown): value is ThrowableHandlerContract {
        return typeof value === 'object' && value !== null && 'enable' in value;
    }
}
```

The abstract `ThrowableHandler` implements the contract and adds the static
trace code method. The trace code is an MD5 hash of the class name and the stack:

```ts
export abstract class ThrowableHandler implements ThrowableHandlerContract {
    static getTraceCode(error: Error): string {
        return createHash('md5')
            .update(error.constructor.name + (error.stack ?? ''))
            .digest('hex');
    }

    abstract enable(options?: { displayErrors?: boolean }): void;
}
```

Note that `enable()` is an instance method in this port. The PHP reference
declares it static.

### The framework ships no concrete handler

This port has no equivalent of the PHP reference's Whoops handler. `App` returns
a handler that does nothing:

```ts
static getThrowableHandler(): ThrowableHandlerContract {
    return { enable: () => {} };
}
```

An application that wants error output overrides `getThrowableHandler()` on its
own entry class. See [Application](../Application/README.md) for the entry class
and for `debugMode`.

## Container binding

`ThrowableServiceId` holds the binding key:

```ts
export class ThrowableServiceId {
    static readonly HandlerContract = 'Valkyrja.Throwable.Handler.ThrowableHandlerContract' as const;
}
```

The `Http`, `Cli`, and `WorkerHttp` entry points call
`bootstrapThrowableHandler()`. The method registers the handler as a singleton,
and it registers nothing when the application is not in debug mode:

```ts
static bootstrapThrowableHandler(app: ApplicationContract, container: ContainerContract): void {
    if (app.getDebugMode()) {
        const errorHandler = this.getThrowableHandler();

        container.setSingleton(ThrowableServiceId.HandlerContract, errorHandler);

        (errorHandler.constructor as { enable?: (opts: { displayErrors: boolean }) => void }).enable?.({
            displayErrors: true,
        });
    }
}
```

Warning: the call reads `enable` from the handler's constructor, so it invokes a
**static** `enable` on the handler's class. A handler that declares only the
instance method is registered, and the framework does not enable it. Declare a
static `enable` on the handler class to be enabled at bootstrap.

No service provider publishes this binding. The entry point registers it
directly.

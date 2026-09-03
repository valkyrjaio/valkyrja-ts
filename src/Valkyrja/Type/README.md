# Type

## Introduction

The Type component holds two support classes. `Cast` records how to convert a
route parameter value. `ObjectFactory` copies an object.

**This component ships no typed value object.** It declares `TypeContract`, and
it holds no implementation of that contract. There is no primitive wrapper, no
identifier type, no collection, no JSON wrapper, and no UUID, ULID, or VLID
support. An application supplies its own type. The component holds three files:

| File                              | Class or contract |
| :-------------------------------- | :---------------- |
| `Contract/TypeContract.ts`        | `TypeContract`    |
| `Data/Cast.ts`                    | `Cast`            |
| `Object/Factory/ObjectFactory.ts` | `ObjectFactory`   |

## TypeContract

`TypeContract` is the contract for a value that the framework converts. A type
holds one value. Two methods return that value, and `modify()` returns a new
type that holds the result of a closure:

```ts
export interface TypeContract {
    asValue(): unknown;
    asFlatValue(): string | number | boolean | null;
    modify(closure: (value: unknown) => unknown): this;
}
```

PHP declares a static `fromValue()` on this contract. No other port can call a
static method on a variable class, so this port leaves the method out. The
container builds the type instead. See
[STATIC_METHODS.md](https://github.com/valkyrjaio/architecture/blob/26.x/STATIC_METHODS.md).

The contract mirrors PHP's `TypeContract`, which every PHP value object
implements. The framework calls `asValue()` only. `asFlatValue()` and `modify()`
are there for the application, and for the ports that hold value objects
already.

## Cast

`Cast` is a data object. It records the type to convert a value to, and how to
return the result:

```ts
export class Cast {
    constructor(
        public readonly type: string,
        public readonly convert: boolean = true,
        public readonly isArray: boolean = false,
    ) {}
}
```

| Property  | Default | Meaning                                         |
| :-------- | :------ | :---------------------------------------------- |
| `type`    | —       | The type to convert the value to                |
| `convert` | `true`  | Return the converted value, and not the wrapper |
| `isArray` | `false` | The value holds more than one item              |

Every property is `readonly`. Build a new `Cast` to change one.

A route parameter carries the cast. Both routing components declare
`withCast()`, `getCast()`, and `hasCast()` on a parameter:

```ts
import { Cast } from '@valkyrjaio/valkyrja/Type/Data/Cast.ts';

const parameter = new ArgumentParameter('name', 'description').withCast(new Cast('string'));
```

`getCast()` throws when the parameter carries no cast. The CLI parameter throws
`CliRoutingNoCastException`.

### Where the framework applies a cast

Two components convert a value, and each one reads `cast.type` differently.

`Matcher.castMatchValue()` reads `cast.type` as a class, and it calls the static
`fromValue()` on that class. It returns `asValue()` when `cast.convert` is
`true`, and the type itself when `cast.convert` is `false`.

An application that sets a cast on an HTTP route parameter supplies that class
itself. The class declares a static `fromValue()` that takes a string, because
the matcher passes the text that the route matched.

Warning: `Cast` declares `type` as a string, so a class does not fit the field.
An application widens the class to build the cast. The widening reads
`new Cast(Slug as unknown as string)`. The CLI needs no widening, because the
CLI reads the same field as a container binding key.

Warning: `Http/Message/Uri/Type/Port.ts` does not fit either. `Port.fromValue()`
takes a number, and it throws `HttpUriInvalidPortException` for the string that
the matcher passes. See [Http](../Http/README.md) for dynamic routes and their
parameters.

`Parameter.getCastValues()` reads `cast.type` as a container binding key, and it
asks the container for that type once for each value. It passes the raw value as
the only argument. It returns `asValue()` when `cast.convert` is `true`, and the
type itself when `cast.convert` is `false`. A parameter that holds no cast
returns each raw value, and a parameter that holds a cast and no container
throws `CliRoutingNoContainerException`.

Warning: register a cast type with `bind`. The parameter calls `getService()`,
which reads only a service binding. An alias, and an instance that
`setSingleton` holds, raise `ContainerInvalidReferenceException`.

`bindSingleton` also registers a callable, so a cast type that `bindSingleton`
registers still resolves. `getService()` skips the singleton cache, so the
parameter builds one instance for each value. That is not the lifetime that
`bindSingleton` states, which is why a cast type takes `bind`.

The application binds the type to the key that the cast names:

```ts
container.bind('App.Type.Slug', Slug.make);

const parameter = new ArgumentParameter('target', 'The target', new Cast('App.Type.Slug')).withContainer(
    container,
);
```

The router gives each parameter the container before it dispatches the command.
See [Cli](../Cli/README.md) for CLI arguments and options.

Warning: the two routing components read `cast.type` differently. The CLI reads
a container binding key. The HTTP `Matcher` reads a class.

Note that no code reads `isArray`.

## ObjectFactory

`ObjectFactory` holds one static method. `clone()` makes a shallow copy that
keeps the prototype of the original:

```ts
export class ObjectFactory {
    static clone<T extends object>(object: T): T {
        return Object.assign(Object.create(Object.getPrototypeOf(object) as object | null) as T, object);
    }
}
```

The copy shares each property value with the original, because the copy is
shallow. A nested object is the same object in both.

Note that this port carries none of the other PHP factory methods. There is no
`toString()`, no `fromString()`, no `getProperties()`, no `toDeepArray()`, and
no `getValueDotNotation()`. There is also no `Cls` support class and no
`PropertyVisibilityFilter` enum.

### The clone-on-write method

`clone()` is how the framework builds an immutable `with…()` method. The method
copies the host, writes the new value on the copy, and returns the copy. The
host does not change:

```ts
withText(text: string): this {
    const clone = ObjectFactory.clone(this);
    clone.text = text;
    return clone;
}
```

More than 30 classes use this method, across [Cli](../Cli/README.md) and
[Http](../Http/README.md). A message, an input, an output, a route, and a
parameter each build a copy this way.

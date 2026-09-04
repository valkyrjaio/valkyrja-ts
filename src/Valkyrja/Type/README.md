# Type

## Introduction

The Type component holds two support classes. `Cast` records how to convert a
route parameter value. `ObjectFactory` copies an object.

**This component ships no typed value object.** It declares `TypeContract`, and
it holds no implementation of that contract. There is no primitive wrapper, no identifier type, no collection, no JSON wrapper, and no
UUID, ULID, or VLID support. The component holds two files:

| File                              | Class           |
| :-------------------------------- | :-------------- |
| `Data/Cast.ts`                    | `Cast`          |
| `Object/Factory/ObjectFactory.ts` | `ObjectFactory` |

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

The HTTP `Matcher` is the one place that converts a matched value. It reads
`cast.type` as a container binding key, and the container builds the type. It
returns `asValue()` when `cast.convert` is `true`, and the type itself when
`cast.convert` is `false`.

The matcher holds the container, so no data object reaches it. The parameter
holds the cast and nothing else about casting.

An application binds the type to the key that the cast names:

```ts
container.bind('App.Type.Slug', Slug.make);

const parameter = new Parameter('slug', '[a-z-]+').withCast(new Cast('App.Type.Slug'));
```

Warning: register a cast type with `bind`. The matcher calls `getService()`,
which reads only a service binding. An alias, and an instance that
`setSingleton` holds, raise `ContainerInvalidReferenceException`.
`getService()` also skips the singleton cache, so a type that `bindSingleton`
registers is built for each match, and not once for the application.

See [Http](../Http/README.md) for dynamic routes and their parameters.

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

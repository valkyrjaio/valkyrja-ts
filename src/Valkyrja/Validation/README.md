# Validation

## Introduction

The Validation component holds a rule-based validation system. A rule wraps one
subject value, and the rule reports whether that value is valid. A `Validator`
groups rules by a subject key, runs every rule, and collects each failure.

The component uses no magic. The application builds each rule, passes the
subject to the constructor, and reads plain strings back.

## Rules

A rule extends the abstract `Rule` class. The constructor takes the subject and
the error message:

```ts
export abstract class Rule implements RuleContract {
    constructor(
        protected subject: unknown,
        protected errorMessage: string,
    ) {}

    getSubject(): unknown {
        return this.subject;
    }

    abstract isValid(): boolean;

    validate(): void {
        if (!this.isValid()) {
            throw new ValidationRuleFailureException(this.errorMessage);
        }
    }
}
```

The base class supplies `validate()`. A concrete rule implements `isValid()`.
`validate()` throws `ValidationRuleFailureException` when `isValid()` returns
`false`.

`RuleContract` declares the three methods:

```ts
export interface RuleContract {
    getSubject(): unknown;
    isValid(): boolean;
    validate(): void;
}
```

A rule that takes an extra argument puts that argument between the subject and
the error message:

```ts
constructor(
    subject: unknown,
    protected readonly min: number,
    errorMessage: string,
)
```

### Available rules

**Identity and presence** — `Rule/Is/`

| Class       | Extra argument   | Passes when                                           |
| :---------- | :--------------- | :---------------------------------------------------- |
| `Required`  | —                | The subject is truthy                                 |
| `NotEmpty`  | —                | The subject is not `''`, `null`, or `undefined`       |
| `IsEmpty`   | —                | The subject is `''`, `null`, or `undefined`           |
| `Equal`     | `value: unknown` | The subject is strictly equal to the value            |
| `NotEqual`  | `value: unknown` | The subject is not strictly equal to the value        |
| `IsString`  | —                | `typeof` the subject is `'string'`                    |
| `IsNumeric` | —                | The subject is a number, or a string `Number()` reads |
| `IsBool`    | —                | `typeof` the subject is `'boolean'`                   |
| `Email`     | —                | The subject is a string, and it matches the pattern   |

Note that `NotEmpty` and `IsEmpty` test three values only. A `0`, a `false`, and
an empty array each pass `NotEmpty`. `Required` uses a truthy test instead, so
`Required` rejects `0` and `false`.

Note that `Email` lives in `Rule/Is/`, and not in `Rule/String/`. The rule tests
the pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.

**String rules** — `Rule/String/`. Each one first tests that the subject is a
string.

| Class        | Extra argument   | Passes when                                    |
| :----------- | :--------------- | :--------------------------------------------- |
| `Min`        | `min: number`    | The length is `min` or more                    |
| `Max`        | `max: number`    | The length is `max` or fewer                   |
| `Contains`   | `needle: string` | The subject contains the needle                |
| `StartsWith` | `needle: string` | The subject starts with the needle             |
| `EndsWith`   | `needle: string` | The subject ends with the needle               |
| `Alpha`      | —                | The subject matches `/^[a-zA-Z]+$/`            |
| `Lowercase`  | —                | The subject equals its own `toLowerCase()`     |
| `Uppercase`  | —                | The subject equals its own `toUpperCase()`     |
| `Regex`      | `regex: string`  | The subject is not `''`, and the regex matches |

Note that `Regex` takes the pattern as a string, and it builds a `RegExp` from
that string. The string carries no delimiter and no flag.

Note that `Alpha` accepts a letter only. The rule rejects a digit, and the
error message constant `STRING_ALPHA` says "alphanumeric".

**Number rules** — `Rule/Int/`

| Class         | Extra argument | Passes when                                    |
| :------------ | :------------- | :--------------------------------------------- |
| `GreaterThan` | `min: number`  | The subject is a number, and it is above `min` |
| `LessThan`    | `max: number`  | The subject is a number, and it is below `max` |

Note that both rules test `typeof` the subject for `'number'`. A numeric string
fails.

**This port ships no ORM rule.** There is no `EntityExists` and no
`EntityNotExists`, because the port has no ORM component.

### Default error messages

`ErrorMessage` holds a default message for each rule:

```ts
import { ErrorMessage } from '@valkyrjaio/valkyrja/Validation/Constant/ErrorMessage.ts';

new Required(name, ErrorMessage.REQUIRED);
```

The constructor takes the message, so nothing reads these constants for you.
Pass one, or pass a message of your own.

Note that `ErrorMessage` holds `ENTITY_EXISTS` and `ENTITY_NOT_EXISTS`. No rule
in this port uses either constant.

### Writing a rule

Extend `Rule` and implement `isValid()`:

```ts
import { Rule } from '@valkyrjaio/valkyrja/Validation/Rule/Abstract/Rule.ts';

export class StrongPassword extends Rule {
    isValid(): boolean {
        return (
            typeof this.subject === 'string' &&
            this.subject.length >= 12 &&
            /[A-Z]/.test(this.subject) &&
            /[0-9]/.test(this.subject)
        );
    }
}
```

## The Validator

`ValidatorContract` declares five methods:

```ts
export interface ValidatorContract {
    validateRules(): boolean;
    setRules(rules: Record<string, RuleContract[]>): void;
    getErrorMessages(): Record<string, string>;
    hasFirstErrorMessage(): boolean;
    getFirstErrorMessage(): string;
}
```

The `Validator` constructor also takes the rules, so `setRules()` is optional:

```ts
constructor(protected rules: Record<string, RuleContract[]> = {}) {}
```

`validateRules()` runs every rule for every key. It stores the message under
that key. It returns `true` when no key holds a message.

Warning: `validateRules()` catches every throwable, and it records a message for
a `ValidationRuleFailureException` only. A rule that throws any other error
leaves no message, so the validator then reports the value as valid. A rule that
reads a property off a `null` subject throws a `TypeError`, and that failure is
silent. Guard the subject's type in `isValid()`, the way each rule above does.

Warning: `getErrorMessages()` returns one message for each key, and not a list.
A second failing rule for the same key overwrites the message of the first. Read
the messages after one `validateRules()` call.

Warning: `validateRules()` does not clear the messages from an earlier call. A
`Validator` runs once. Build a new `Validator` for a second set of values.

Each stored message carries the key as a prefix:

```ts
this.errorMessages[subject] = `${subject}: ${e.message}`;
```

`getFirstErrorMessage()` returns the first message, and it returns `''` when no
rule failed.

**No provider publishes the validator.** The Validation component declares no
binding key and no service provider. The application builds a `Validator`
itself. See [Container](../Container/README.md) to register one.

## A complete example

```ts
import { Email } from '@valkyrjaio/valkyrja/Validation/Rule/Is/Email.ts';
import { NotEmpty } from '@valkyrjaio/valkyrja/Validation/Rule/Is/NotEmpty.ts';
import { Required } from '@valkyrjaio/valkyrja/Validation/Rule/Is/Required.ts';
import { Max } from '@valkyrjaio/valkyrja/Validation/Rule/String/Max.ts';
import { Min } from '@valkyrjaio/valkyrja/Validation/Rule/String/Min.ts';
import { Validator } from '@valkyrjaio/valkyrja/Validation/Validator/Validator.ts';

const validator = new Validator({
    email: [
        new Required(email, 'Email is required.'),
        new NotEmpty(email, 'Email cannot be empty.'),
        new Email(email, 'Must be a valid email address.'),
    ],
    name: [
        new Required(name, 'Name is required.'),
        new Min(name, 3, 'Name must be at least 3 characters.'),
        new Max(name, 100, 'Name must not exceed 100 characters.'),
    ],
});

if (!validator.validateRules()) {
    const errors = validator.getErrorMessages();
    // { email: 'email: Must be a valid email address.' }
}
```

## Exceptions

| Class                            | Extends                      |
| :------------------------------- | :--------------------------- |
| `ValidationRuleFailureException` | `ValidationRuntimeException` |

`ValidationRuntimeException` and `ValidationInvalidArgumentException` are the
abstract bases. Both implement `ValidationThrowable`. See
[Throwable](../Throwable/README.md) for the hierarchy.

# CLI

## Introduction

The Cli component runs a command-line application. It parses the argument
vector, matches a command, runs the command's handler, and writes the messages
that the handler returned.

The component holds four sub-components:

| Sub-component | Holds                                                   |
| :------------ | :------------------------------------------------------ |
| `Interaction` | The input, the output, the messages, and the formatters |
| `Routing`     | The commands, their parameters, and the router          |
| `Middleware`  | The six middleware stages and their handlers            |
| `Server`      | The input handler and the built-in commands             |

## Entry point

`Cli.run()` boots the application and runs the input handler. See
[Application](../Application/README.md) for the bootstrap:

```ts
import { Cli } from '@valkyrjaio/valkyrja/Application/Entry/Cli.ts';

Cli.run(new CliConfig());
```

`Cli.getInput()` builds the input from `process.argv`. It drops the first
element, because that element is the interpreter path:

```ts
return InputFactory.fromGlobals(process.argv.slice(1), config.applicationName, config.defaultCommandName);
```

## Configuration

`CliConfig` implements `CliConfigContract`. Two properties belong to the CLI:

| Property             | Default               | Holds                                            |
| :------------------- | :-------------------- | :----------------------------------------------- |
| `applicationName`    | `'valkyrja'`          | The name that the help output prints             |
| `defaultCommandName` | `CliCommandName.LIST` | The command that runs when the vector names none |

`CliConfig` also carries six middleware lists. Each list holds binding keys:

| List                        | Default                                                                                                        |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `inputReceivedMiddleware`   | `CheckForHelpOptionsMiddleware`, `CheckForVersionOptionsMiddleware`, `CheckGlobalInteractionOptionsMiddleware` |
| `routeMatchedMiddleware`    | Empty                                                                                                          |
| `routeNotMatchedMiddleware` | `CheckCommandForTypoMiddleware`                                                                                |
| `routeDispatchedMiddleware` | Empty                                                                                                          |
| `throwableCaughtMiddleware` | `LogThrowableCaughtMiddleware`, `OutputThrowableCaughtMiddleware`                                              |
| `processExitingMiddleware`  | Empty                                                                                                          |

Warning: `LogThrowableCaughtMiddleware` resolves the logger binding. The
application binds a logger, or that middleware fails to publish. See
[Log](../Log/README.md).

### Interaction config

`CliInteractionConfigContract` holds three flags:

```ts
export interface CliInteractionConfigContract {
    isQuiet: boolean;
    isInteractive: boolean;
    isSilent: boolean;
}
```

The provider reads the application config first. It uses the application config
when that config implements the contract, and it falls back to a default:

```ts
static publishConfig(this: void, container: ContainerContract): void {
    const config = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);

    if (CliInteractionConfigContract.instanceOf(config)) {
        container.setSingleton(CliInteractionServiceId.CliInteractionConfigContract, config);

        return;
    }

    container.setSingleton(CliInteractionServiceId.CliInteractionConfigContract, new CliInteractionConfig());
}
```

Note that `CliInteractionConfig` defaults to `isInteractive: true`, `isQuiet:
false`, and `isSilent: false`.

## Command-line syntax

`InputFactory.fromGlobals()` splits the vector into a caller, a command name,
arguments, and options:

| Position                    | Becomes                                    |
| :-------------------------- | :----------------------------------------- |
| Element 0                   | The caller                                 |
| Element 1                   | The command name, when it is not an option |
| Anything with a leading `-` | An option                                  |
| Everything else             | An argument                                |

Three rules govern the dash:

- A lone `-` is never an option. By convention it names standard input. The
  position rules above therefore apply to it: element 0 makes it the caller,
  element 1 makes it the command name, and element 2 or later makes it an
  argument.
- `--` is the POSIX end-of-options marker. The factory consumes it, and every
  later element is an argument.
- A second `--` after the marker is an ordinary argument.

`OptionFactory.fromArg()` parses one option:

- `--name=value` splits on the **first** `=`, so a value that holds an `=`
  survives. `--expr=a=b` yields the value `a=b`.
- `--name` yields an empty value.
- `-abc` splits into three short options, each with an empty value.

Warning: a combined short option takes no value. `-abc=1` throws
`CliInteractionInvalidEmptyValueException`.

Warning: an option with an empty name throws
`CliInteractionInvalidNonEmptyValueException`.

## Routing

### The route

`RouteContract` holds the command name, the description, the help text, the
parameters, the middleware for four stages, and the handler:

```ts
getHandler(): (container: ContainerContract, route: RouteContract) => OutputContract;
```

The handler takes the container and the matched route. It returns an output.
Every `with…()` method returns a copy, so a route never changes in place.

### Route providers

A route provider names its controller classes and returns its pre-built routes:

```ts
export interface CliRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown>;
    getRoutes(): RouteContract[];
}
```

The application returns each provider from `getCliProviders()`. See
[Application](../Application/README.md).

### Decorator registration

Declare a command on a controller method with `@Route`:

```ts
export function Route<THandler = unknown, THelpText = unknown>(options: CliRouteOptions<THandler, THelpText>) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureCliRouteMethodMetadata(context.metadata, context.name).routes.push(createCliRouteDefinition(options));
    };
}
```

The decorator writes to the class metadata. `sindri` reads the same decorator
statically to build the command cache, and the runtime
`AttributeRouteCollector` reads the metadata in debug mode.

`CliRouteOptions` takes the name, the description, the handler, the help text,
and the middleware. `@ArgumentParameter` and `@OptionParameter` declare the
parameters, and `@Name`, `@Middleware`, and `@RouteHandler` each set one field.

**Warning: never name a class directly in a decorator argument. Thunk it.** A
decorator argument is evaluated at class-definition time, so a direct reference
throws `ReferenceError: Cannot access 'X' before initialization` on a circular
import, or where a class names itself:

```ts
// Wrong — the argument dereferences a binding that may still be initializing.
@RouteHandler([CliRouteProvider, 'testCommandHandler'])

// Right — the thunk captures the binding without reading it.
@RouteHandler([() => CliRouteProvider, 'testCommandHandler'])
```

### Arguments

An `ArgumentParameter` carries a name, a description, an optional cast, a mode,
and a value mode:

| Enum                | Cases                  |
| :------------------ | :--------------------- |
| `ArgumentMode`      | `REQUIRED`, `OPTIONAL` |
| `ArgumentValueMode` | `DEFAULT`, `ARRAY`     |

The router fills each parameter in order. A parameter in `ARRAY` value mode
takes every argument that is left, so an `ARRAY` parameter must be the last
parameter that the command declares. A parameter that follows an `ARRAY`
parameter receives nothing.

`validateValues()` then runs, and it throws
`CliRoutingArgumentValuesValidationException` when a required parameter has no
value.

### Options

An `OptionParameter` carries a name, a description, a display name for the
value, an optional cast, a default value, the short names, the valid values, a
mode, and a value mode:

| Enum              | Cases                      |
| :---------------- | :------------------------- |
| `OptionMode`      | `REQUIRED`, `OPTIONAL`     |
| `OptionValueMode` | `NONE`, `DEFAULT`, `ARRAY` |

The router matches an option by its name, or by any of its short names. Each
option that the caller repeats reaches the same parameter, and
`validateValues()` then throws `CliRoutingOptionValuesValidationException` for a
parameter in `DEFAULT` value mode.

### The global options

| Name               | Short | Does                                |
| :----------------- | :---- | :---------------------------------- |
| `--help`           | `-h`  | Print the help text for the command |
| `--version`        | `-v`  | Print the framework version         |
| `--quiet`          | `-q`  | Write less output                   |
| `--silent`         | `-s`  | Write no output                     |
| `--no-interaction` | `-N`  | Never ask a question                |

The three `inputReceivedMiddleware` defaults read these options.

Note that `OptionName` and `OptionShortName` also declare `TOKEN` and `t`.
Nothing in this port reads either constant.

### Renaming a built-in option

`CliServerServiceProvider` reads the application config for a new name. Declare
the properties on the config class, and the provider passes them to the
middleware:

```ts
static publishCheckForHelpOptionsMiddleware(this: void, container: ContainerContract): void {
    const config = container.getSingleton<ConfigContract>(ApplicationServiceId.ConfigContract);
    let commandName: string = CliCommandName.HELP;
    let name: string = OptionName.HELP;
    let shortName: string = OptionShortName.HELP;

    if (CliServerServiceProvider.isHelpCommandConfig(config)) {
        commandName = config.helpCommandName;
        name = config.helpOptionName;
        shortName = config.helpOptionShortName;
    }

    container.setSingleton<CheckForHelpOptionsMiddleware>(
        CliServerServiceId.CheckForHelpOptionsMiddleware,
        new CheckForHelpOptionsMiddleware(commandName, name, shortName),
    );
}
```

| Option             | Config properties                                                   |
| :----------------- | :------------------------------------------------------------------ |
| `--help`           | `helpCommandName`, `helpOptionName`, `helpOptionShortName`          |
| `--version`        | `versionCommandName`, `versionOptionName`, `versionOptionShortName` |
| `--no-interaction` | `noInteractionOptionName`, `noInteractionOptionShortName`           |
| `--quiet`          | `quietOptionName`, `quietOptionShortName`                           |
| `--silent`         | `silentOptionName`, `silentOptionShortName`                         |

The provider tests the config for each group on its own, so a config renames one
group and keeps the default for the rest.

### Value casting

A parameter carries an optional `Cast`. See [Type](../Type/README.md).

Note that the CLI stores the cast and does not apply it.
`getCastValuesForParameters()` returns each raw value, whether the parameter
carries a cast or not.

## Input and output

### Input

`InputContract` holds the caller, the command name, the arguments, and the
options. Every mutator returns a copy:

```ts
const next = input.withCommandName('list').withAddedOption(new Option('quiet', '', OptionType.SHORT));
```

The input handler registers the input under
`CliInteractionServiceId.InputContract`, so a handler resolves it from the
container.

### Output

`OutputContract` holds the messages, the writers, three interaction flags, and
the exit code. `writeMessages()` writes each unwritten message.

| Class          | Writes to                                          |
| :------------- | :------------------------------------------------- |
| `Output`       | The base class                                     |
| `PlainOutput`  | `process.stdout`, with every `<tag>` removed       |
| `StreamOutput` | A `NodeJS.WritableStream` that the caller supplies |
| `FileOutput`   | A file path that the caller supplies               |
| `EmptyOutput`  | Nothing                                            |

Use `EmptyOutput` in a test, and for a command that must write nothing.

`FileOutput` appends the formatted text to the filepath with `appendFileSync`,
and it makes the file when the file does not exist. A failed write throws
`CliInteractionFileWriteException`. `FileOutput` never truncates, so the file
keeps the messages of each earlier run and the caller owns truncation.

`StreamOutput` writes the formatted text to the stream. A Node writable reports
a failed write on an `error` event rather than to the caller, so the
application attaches that listener before it hands the stream over.

Warning: a factory-built `FileOutput` or `StreamOutput` copies the interaction
flags. `--quiet` and `--silent` then suppress a file write and a stream write,
and not only a terminal write.

### Messages

A message holds its text and an optional formatter:

```ts
getFormattedText(): string {
    const text = this.getText();
    const formatter = this.formatter;

    if (formatter === null) {
        return text;
    }

    return formatter.formatText(text);
}
```

| Class            | Is                              |
| :--------------- | :------------------------------ |
| `Message`        | Plain text                      |
| `ErrorMessage`   | Text with the error formatter   |
| `SuccessMessage` | Text with the success formatter |
| `WarningMessage` | Text with the warning formatter |
| `Banner`         | A message inside a banner       |
| `Header`         | A section header                |
| `NewLine`        | A line break                    |
| `Progress`       | A progress indicator            |
| `Question`       | A question that reads an answer |
| `Answer`         | The answer to a question        |
| `Messages`       | A group of messages             |

Warning: `getFormatter()` throws `CliInteractionNoFormatterException` when the
message carries no formatter. Call `hasFormatter()` first.

### Formatters

| Class                      | Applies             |
| :------------------------- | :------------------ |
| `Formatter`                | The base class      |
| `ErrorFormatter`           | The error style     |
| `SuccessFormatter`         | The success style   |
| `WarningFormatter`         | The warning style   |
| `QuestionFormatter`        | The question style  |
| `HighlightedTextFormatter` | The highlight style |

A formatter builds an ANSI escape sequence from three enums. `TextColor` and
`BackgroundColor` hold the color codes, and `Style` holds `BOLD`,
`UNDERSCORE`, `BLINK`, `INVERSE`, and `CONCEAL`.

### Exit codes

`ExitCode` holds a set modeled on `sysexits.h`:

| Case          | Value |
| :------------ | :---- |
| `SUCCESS`     | 0     |
| `ERROR`       | 1     |
| `USAGE_ERROR` | 64    |
| `DATA_ERROR`  | 65    |
| `NO_INPUT`    | 67    |
| `AUTO_EXIT`   | 255   |

The set also holds `NO_USER` (68), `UNAVAILABLE` (69), `SOFTWARE_ERROR` (70),
`OS_ERROR` (71), `OS_FILE_ERROR` (72), `CANT_CREATE` (73), `IO_ERROR` (74),
`TEMP_FAIL` (75), `PROTOCOL_ERROR` (76), `NO_PERMISSION` (77), and
`CONFIG_ERROR` (78).

Warning: two cases do not carry their `sysexits.h` value. `NO_INPUT` is 67, and
`EX_NOINPUT` is 66. `NO_USER` is 68, and `EX_NOUSER` is 67. The enum also
declares no case for `EX_NOHOST` (68). Every case from `UNAVAILABLE` (69) down
matches `sysexits.h`. A script that reads the man page for a value therefore
misreads these two.

`withExitCode()` accepts an `ExitCode` or a plain number.

## The input handler

`InputHandlerContract` declares three methods:

```ts
export interface InputHandlerContract {
    handle(input: InputContract): OutputContract;
    exit(input: InputContract, output: OutputContract): void;
    run(input: InputContract): void;
}
```

`run()` calls `handle()`, writes the messages, runs the exit stage, and exits
with the output's code:

```ts
run(input: InputContract): void {
    let output = this.handle(input);

    try {
        output = output.writeMessages();
    } catch (throwable: unknown) {
        // The recovery path writes to stdout, so the exit stage still runs.
    }

    this.container.setSingleton<OutputContract>(CliInteractionServiceId.OutputContract, output);

    this.exit(input, output);

    this.signalExitCode(output.getExitCode());
}
```

`run()` keeps the output that `writeMessages()` returns, and registers it as
the `OutputContract` singleton. A write throwable routes to the
`ThrowableCaught` stage, and the recovery output writes to stdout, so the exit
stage and the exit code still run.

`signalExitCode` calls `Exiter.setExitCode`, which sets `process.exitCode` and
lets the event loop drain. `SyncInputHandler` overrides it to call
`Exiter.exit`, which ends the process at once and drops a buffered write.

`handle()` catches every throwable. It builds an error output, and it runs the
`ThrowableCaught` stage over that output.

**An application binds its own handler.** The framework ships one
implementation, `InputHandler`, and `CliServerServiceProvider` publishes it
under `CliServerServiceId.InputHandlerContract`. Bind a different
implementation to that key in an application service provider to replace it.
See [Container](../Container/README.md).

## Middleware

Six stages run in one command. Each stage has a middleware contract and a
handler contract:

| Stage             | Middleware method   | Returns                                  |
| :---------------- | :------------------ | :--------------------------------------- |
| `InputReceived`   | `inputReceived()`   | An input, or an output that ends the run |
| `RouteMatched`    | `routeMatched()`    | A route, or an output that ends the run  |
| `RouteNotMatched` | `routeNotMatched()` | An output                                |
| `RouteDispatched` | `routeDispatched()` | An output                                |
| `ThrowableCaught` | `throwableCaught()` | An output                                |
| `ProcessExiting`  | `processExiting()`  | Nothing                                  |

Each middleware takes the handler as its last parameter, and it calls the
handler to continue the chain:

```ts
export interface InputReceivedMiddlewareContract {
    inputReceived(input: InputContract, handler: InputReceivedHandlerContract): InputContract | OutputContract;
}
```

`InputReceived` and `RouteMatched` short-circuit. A middleware that returns an
output ends the run, and the router never dispatches the command.

**Middleware is appended, never deduplicated.** A middleware that is registered
twice runs twice. A duplicate is the application's own error, and the framework
does not correct it.

### Registering middleware

Register globally through the config lists above. Register for one command
through the route:

```ts
route.withAddedRouteMatchedMiddleware(AppCliServiceId.AuthMiddleware);
```

A route carries a list for `RouteMatched`, `RouteDispatched`,
`ThrowableCaught`, and `ProcessExiting`. A route carries no `InputReceived`
list, because the input handler runs that stage before it matches a route.

## Built-in commands

`CliServerServiceProvider` publishes four commands:

| Command     | Class             | Does                                   |
| :---------- | :---------------- | :------------------------------------- |
| `help`      | `HelpCommand`     | Print the help text for a command      |
| `list`      | `ListCommand`     | List every command                     |
| `list:bash` | `ListBashCommand` | List every command for bash completion |
| `version`   | `VersionCommand`  | Print the framework version            |

`CliCommandName` also declares `data:generate`. **This port ships no
`data:generate` command.** `sindri` owns that command.

## Lifecycle

1. `Cli.run()` boots the application.
2. `InputFactory` builds the input from the argument vector.
3. The input handler registers the input in the container.
4. The `InputReceived` stage runs. An output here ends the run.
5. The router matches the command name against the collection.
6. A miss runs the `RouteNotMatched` stage and returns its output.
7. A match fills the route's arguments and options, then runs the
   `RouteMatched` stage.
8. The router registers the route and calls the handler.
9. The `RouteDispatched` stage runs over the handler's output.
10. A throwable at any point runs the `ThrowableCaught` stage.
11. `run()` writes the messages, runs the `ProcessExiting` stage, and exits.

## Container bindings

| Id                                                     | Holds                                  |
| :----------------------------------------------------- | :------------------------------------- |
| `CliServerServiceId.InputHandlerContract`              | An `InputHandler`                      |
| `CliRoutingServiceId.RouterContract`                   | A `Router`                             |
| `CliRoutingServiceId.RouteCollectionContract`          | A `RouteCollection`                    |
| `CliRoutingServiceId.RouteCollectorContract`           | An `AttributeRouteCollector`           |
| `CliRoutingServiceId.CliRoutingData`                   | The collection's `CliRoutingData`      |
| `CliRoutingServiceId.RouteContract`                    | The matched route, set at dispatch     |
| `CliInteractionServiceId.CliInteractionConfigContract` | The interaction config                 |
| `CliInteractionServiceId.OutputFactoryContract`        | An `OutputFactory`                     |
| `CliInteractionServiceId.InputContract`                | The current input                      |
| `CliInteractionServiceId.OutputContract`               | The output, set after `handle()`       |
| `CliMiddlewareServiceId.*HandlerContract`              | One handler for each of the six stages |
| `CliServerServiceId.*Middleware`                       | Each built-in middleware               |
| `CliServerServiceId.*Command`                          | Each built-in command                  |

Note that `CliRoutingServiceId.CliRoutingConfigContract` is declared, and no
provider publishes it. The port also declares no `CliRoutingConfig` class.

Like the Event component, the route collection publisher takes one of two paths.
In debug mode it walks every route provider and builds the data again. Outside
debug mode it loads the cached `CliRoutingData`.

## Exceptions

`Interaction` throws:

| Class                                           | Thrown when                                  |
| :---------------------------------------------- | :------------------------------------------- |
| `CliInteractionInvalidOptionNameException`      | An option does not begin with a dash         |
| `CliInteractionInvalidNonEmptyValueException`   | An option name is empty                      |
| `CliInteractionInvalidEmptyValueException`      | A combined short option carries a value      |
| `CliInteractionNoFormatterException`            | `getFormatter()` runs on a message with none |
| `CliInteractionExpectedQuestionOutputException` | The output for a question is the wrong kind  |
| `CliInteractionNoValidationCallableException`   | A question has no validation callable        |

`Routing` throws:

| Class                                         | Thrown when                                  |
| :-------------------------------------------- | :------------------------------------------- |
| `CliRoutingArgumentValuesValidationException` | An argument fails validation                 |
| `CliRoutingOptionValuesValidationException`   | An option fails validation                   |
| `CliRoutingInvalidArgumentNameException`      | A route holds no argument with that name     |
| `CliRoutingInvalidOptionNameException`        | A route holds no option with that name       |
| `CliRoutingInvalidOptionWithValueException`   | An option carries a value it must not        |
| `CliRoutingInvalidRouteNameException`         | The collection holds no route with that name |
| `CliRoutingNoCastException`                   | `getCast()` runs on a parameter with none    |
| `CliRoutingNoHelpTextException`               | `getHelpText()` runs on a route with none    |

Note that `CliRoutingInvalidHelpTextCallableException` and
`CliRoutingNoOutputDispatchException` are declared, and nothing in this port
throws either one.

Each sub-component also ships an abstract `…RuntimeException` and an abstract
`…InvalidArgumentException`. See [Throwable](../Throwable/README.md) for the
hierarchy.

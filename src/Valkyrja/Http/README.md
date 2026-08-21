# HTTP

## Introduction

The Http component serves an HTTP request. It builds a request object from the
Node request, matches a route, runs the route's handler, and writes the
response to the Node response.

The component holds six sub-components:

| Sub-component | Holds                                                            |
| :------------ | :--------------------------------------------------------------- |
| `Message`     | The request, the response, the URI, the headers, and the streams |
| `Routing`     | The routes, the matcher, the router, and the URL generator       |
| `Middleware`  | The seven middleware stages and their handlers                   |
| `Server`      | The request handler and the built-in middleware                  |
| `Struct`      | The typed request and response shapes                            |
| `Client`      | The outgoing client contract                                     |

## Configuration and entry point

`Http.run()` serves a request, and `WorkerHttp.run()` serves many. See
[Application](../Application/README.md) for the bootstrap and for the child
container:

```ts
import { Http } from '@valkyrjaio/valkyrja/Application/Entry/Http.ts';

Http.run(new HttpConfig(), 3000);
```

`HttpConfig` carries seven middleware lists, and each list holds binding keys:

| List                        | Stage             |
| :-------------------------- | :---------------- |
| `requestReceivedMiddleware` | `RequestReceived` |
| `routeMatchedMiddleware`    | `RouteMatched`    |
| `routeNotMatchedMiddleware` | `RouteNotMatched` |
| `routeDispatchedMiddleware` | `RouteDispatched` |
| `throwableCaughtMiddleware` | `ThrowableCaught` |
| `sendingResponseMiddleware` | `SendingResponse` |
| `responseSentMiddleware`    | `ResponseSent`    |

Each list is empty by default.

## The request handler

`RequestHandler` runs one request:

```ts
run(request: ServerRequestContract, nodeResponse: ServerResponse): void {
    let response = this.handle(request);

    response = this.sendingResponseHandler.sendingResponse(request, response);
    this.container.setSingleton(Response.name, response);
    this.send(response, nodeResponse);
    this.terminate(request, response);
}
```

| Method        | Does                                                         |
| :------------ | :----------------------------------------------------------- |
| `handle()`    | Run the middleware and the router, and catch every throwable |
| `send()`      | Write the status, the headers, and the body to Node          |
| `terminate()` | Run the `ResponseSent` stage                                 |
| `run()`       | Call each of the three, in order                             |

`handle()` registers the request under
`HttpMessageServiceId.ServerRequestContract`, so a route handler resolves it
from the container.

Note that the handler registers the response under `Response.name`, and this
port declares no binding key constant for the response.

Warning: `getResponseFromThrowable()` rethrows when the handler is in debug
mode. A debug server therefore returns no response for a throwable. The
constructor takes the debug flag, and `HttpServerServiceProvider` reads it from
the application.

## Routing

### The route

`RouteContract` holds the path, the name, the request methods, the handler, the
middleware for five stages, and the two structs:

```ts
getHandler(): (container: ContainerContract, route: RouteContract) => ResponseContract;
```

Every `with…()` method returns a copy.

**HTTP route middleware are constructor references, and not binding keys:**

```ts
getRouteMatchedMiddleware(): Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>;
```

Note that [Cli](../Cli/README.md) spells the same field as `string[]`, and it
holds a binding key. The two components differ here.

### Route providers

A route provider names its controller classes and returns its pre-built routes:

```ts
export interface HttpRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown>;
    getRoutes(): Array<RouteContract | DynamicRouteContract>;
}
```

The application returns each provider from `getHttpProviders()`.

### Decorator registration

`@Route` declares a route on a controller method. `RouteOptions` takes the
path, the name, the handler, the request methods, the middleware, the two
structs, and the path parameters.

**Warning: never name a class directly in a decorator argument. Thunk it.** A
decorator argument is evaluated at class-definition time, so a direct reference
throws `ReferenceError: Cannot access 'X' before initialization` on a circular
import, or where a class names itself:

```ts
// Wrong — the argument dereferences a binding that may still be initializing.
@RouteHandler([HomeController, 'index'])

// Right — the thunk captures the binding without reading it.
@RouteHandler([() => HomeController, 'index'])
```

`@Path`, `@Name`, `@Middleware`, `@RequestMethod`, `@RequestStruct`,
`@ResponseStruct`, and `@RouteHandler` each set one field.

### Dynamic routes

A path that holds a `{parameter}` placeholder is a dynamic route. `@Route` and
`@DynamicRoute` both accept the `parameters` option, and both promote such a
path on their own. `@DynamicRoute` states the intent, and it adds no behavior:

```ts
export type DynamicRouteOptions<THandler = unknown> = RouteOptions<THandler>;
```

A parameter carries a name, a regex, an optional cast, and three more fields:

```ts
export interface ParameterOptions {
    name: string;
    regex: string;
    cast?: Cast | null;
    isOptional?: boolean;
    shouldCapture?: boolean;
    default?: unknown;
}
```

TC39 Stage-3 declares no parameter decorator, so the parameters sit in the
route options. PHP writes each one as its own `#[Parameter]`.

### Matching

`Matcher.match()` normalizes the path, tries the static routes, and then tries
the dynamic ones:

```ts
match(path: string, requestMethod: RequestMethod): RouteContract | null {
    const normalizedPath = '/' + path.replace(/^\/+|\/+$/g, '');
    const route = this.matchStatic(normalizedPath, requestMethod);

    return route ?? this.matchDynamic(normalizedPath, requestMethod);
}
```

**A stored regex is a native anchored pattern.** `Regex.START` is `^` and
`Regex.END` is `$`, with no delimiter. `Matcher` builds the pattern with
`new RegExp(regex)`, and a `RegExp` from a string takes no delimiter. The PHP
reference stores a PCRE-delimited `/^…$/`, and that form never matches here.

A dynamic match reads the named capture groups, and it falls back to each
parameter's default:

```ts
const match = namedGroups[name] ?? parameter.getDefault();
```

Warning: `processArguments()` throws `HttpRoutingInvalidRoutePathException` when
a dynamic route declares no parameter.

### The router

`Router.dispatch()` matches, then dispatches:

```ts
protected attemptToMatchRoute(request: ServerRequestContract): RouteContract | ResponseContract {
    const requestPath = decodeURIComponent(request.getUri().getPath());
    const route = this.matcher.match(requestPath, request.getMethod());

    if (route !== null) {
        return route;
    }

    if (this.matcher.match(requestPath, RequestMethod.ANY) !== null) {
        return this.responseFactory.createResponse(null, StatusCode.METHOD_NOT_ALLOWED);
    }

    return this.responseFactory.createResponse(null, StatusCode.NOT_FOUND);
}
```

A path that matches under `ANY` but not under the request's own method yields 405. A path that matches nothing yields 404.

`routeMatched()` appends the route's middleware onto each stage handler before
the route runs. It also registers the route in the container.

Note that the router registers the route under the literal string
`'RouteContract'`, and not under `HttpRoutingServiceId.RouteContract`.

### URL generation

`UrlContract` declares one method:

```ts
export interface UrlContract {
    getUrl(name: string, data: Record<string, string | number>): string;
}
```

## Requests

| Class               | Is                                       |
| :------------------ | :--------------------------------------- |
| `Request`           | The base request                         |
| `ServerRequest`     | A request with the server data           |
| `JsonServerRequest` | A server request that parses a JSON body |

`RequestFactory` builds one from a Node request:

```ts
const request = RequestFactory.fromNodeRequest(nodeRequest);
const jsonRequest = RequestFactory.jsonFromNodeRequest(nodeRequest);
```

The factory joins a repeated header with `', '`, reads the scheme from the
socket's `encrypted` flag, parses the cookie header, and reads the query from a
`URL`.

`RequestMethod` holds `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `CONNECT`,
`OPTIONS`, `TRACE`, `PATCH`, and `ANY`. `allRequestMethods()` returns the nine
real methods, and it omits `ANY`.

The `Message` sub-component also holds the `Uri`, the `Header` collection, the
`Stream` classes, the `Param` collections, and the uploaded `File` classes.

## Responses

| Class              | Body                |
| :----------------- | :------------------ |
| `Response`         | The base response   |
| `TextResponse`     | Plain text          |
| `HtmlResponse`     | HTML                |
| `JsonResponse`     | JSON                |
| `XmlResponse`      | XML                 |
| `EmptyResponse`    | Nothing             |
| `RedirectResponse` | A `Location` header |

`ResponseFactoryContract` builds five of them:

```ts
export interface ResponseFactoryContract {
    createResponse(content?, statusCode?, headers?): ResponseContract;
    createTextResponse(content?, statusCode?, headers?): TextResponseContract;
    createJsonResponse(data?, statusCode?, headers?): JsonResponseContract;
    createJsonpResponse(callback, data?, statusCode?, headers?): JsonResponseContract;
    createRedirectResponse(uri?, statusCode?, headers?): RedirectResponseContract;
}
```

`StatusCode` and `StatusText` hold the status codes and their reason phrases.
`ProtocolVersion`, `Scheme`, and `SameSite` hold the other message enums.

## Structs

A struct declares the shape of a request or a response. `StructContract` is the
root. The request structs are abstract:

| Class                     | Reads            |
| :------------------------ | :--------------- |
| `RequestStruct`           | The base         |
| `QueryRequestStruct`      | The query string |
| `ParsedBodyRequestStruct` | The parsed body  |
| `JsonRequestStruct`       | The JSON body    |

`ResponseStruct` is the response base. A route carries one of each, and
`hasRequestStruct()` and `hasResponseStruct()` report whether it does.

Warning: `getRequestStruct()` throws `HttpRoutingNoRequestStructException` when
the route carries none. `getResponseStruct()` throws
`HttpRoutingNoResponseStructException`.

Warning: `JsonRequestStruct` throws
`HttpStructJsonServerRequestExpectedException` for a request that is not a
`JsonServerRequest`.

## The middleware pipeline

Seven stages run in one request. Each stage has a middleware contract and a
handler contract:

| Stage             | Middleware method   | Returns                                    |
| :---------------- | :------------------ | :----------------------------------------- |
| `RequestReceived` | `requestReceived()` | A request, or a response that ends the run |
| `RouteMatched`    | `routeMatched()`    | A route, or a response that ends the run   |
| `RouteNotMatched` | `routeNotMatched()` | A response                                 |
| `RouteDispatched` | `routeDispatched()` | A response                                 |
| `ThrowableCaught` | `throwableCaught()` | A response                                 |
| `SendingResponse` | `sendingResponse()` | A response                                 |
| `ResponseSent`    | `responseSent()`    | Nothing                                    |

`RequestReceived` and `RouteMatched` short-circuit. A middleware that returns a
response ends the run, and the router never dispatches the route.

**Middleware is appended, never deduplicated.** A middleware that is registered
twice runs twice. A duplicate is the application's own error, and the framework
does not correct it.

### The built-in middleware

| Class                             | Stage             | Does                                    |
| :-------------------------------- | :---------------- | :-------------------------------------- |
| `LogThrowableCaughtMiddleware`    | `ThrowableCaught` | Log the throwable with the request path |
| `NoCacheResponseMiddleware`       | `SendingResponse` | Set the no-cache headers                |
| `ResponseStructMiddleware`        | `RouteMatched`    | Apply the route's response struct       |
| `RedirectTrailingSlashMiddleware` | `RequestReceived` | Redirect a path with a trailing slash   |

Note that no provider publishes these four. The application registers the one
it wants. `LogThrowableCaughtMiddleware` takes a logger, see
[Log](../Log/README.md).

**This port has no response caching.** The PHP reference caches a response
through a dedicated middleware and store. This port ships
`NoCacheResponseMiddleware` only.

### Registering middleware

Register globally through the `HttpConfig` lists, which hold binding keys.
Register for one route through the route, which holds constructor references:

```ts
route.withAddedRouteMatchedMiddleware(AuthMiddleware);
```

## HttpResponseException

`HttpResponseException` carries a status code, headers, and an optional
response:

```ts
constructor(
    statusCode: StatusCode | null = null,
    message: string | null = null,
    headers: HeaderCollectionContract | null = null,
    response: ResponseContract | null = null,
)
```

The constructor resolves the status code from the argument, then from the
response, and then falls back to `INTERNAL_SERVER_ERROR`. It also rewrites the
response's status code to match.

`RequestHandler` reads the exception's response, and it builds a default
response when the exception carries none.

`HttpNotFoundResponseException` and `HttpRedirectResponseException` are the two
specific forms.

## The HTTP client

`ClientContract` declares one method:

```ts
export interface ClientContract {
    sendRequest(request: RequestContract): ResponseContract;
}
```

**This port ships no client that makes a request.** Two implementations exist,
and neither one opens a socket:

| Class        | Does                                                      |
| :----------- | :-------------------------------------------------------- |
| `NullClient` | Return an `EmptyResponse`                                 |
| `LogClient`  | Log the request at `info`, then return an `EmptyResponse` |

An application that must make a request implements `ClientContract` itself.

**This port declares no PSR compatibility.** PSR-7 and PSR-18 are PHP
standards.

## Request lifecycle

1. The entry point builds a `ServerRequest` from the Node request.
2. The request handler registers the request in the container.
3. The `RequestReceived` stage runs. A response here ends the run.
4. The matcher normalizes the path, then tries the static and dynamic routes.
5. A miss runs the `RouteNotMatched` stage with a 404 or a 405.
6. A match appends the route's middleware, then runs the `RouteMatched` stage.
7. The router registers the route and calls the handler.
8. The `RouteDispatched` stage runs over the handler's response.
9. A throwable at any point runs the `ThrowableCaught` stage.
10. The `SendingResponse` stage runs, and the handler writes to Node.
11. The `ResponseSent` stage runs.

## Container bindings

| Id                                             | Holds                                    |
| :--------------------------------------------- | :--------------------------------------- |
| `HttpServerServiceId.RequestHandlerContract`   | A `RequestHandler`                       |
| `HttpMessageServiceId.ServerRequestContract`   | The current request                      |
| `HttpMessageServiceId.ResponseFactoryContract` | A `ResponseFactory`                      |
| `HttpRoutingServiceId.RouterContract`          | A `Router`                               |
| `HttpRoutingServiceId.RouteCollectionContract` | A `RouteCollection`                      |
| `HttpRoutingServiceId.RouteCollectorContract`  | An `AttributeRouteCollector`             |
| `HttpRoutingServiceId.MatcherContract`         | A `Matcher`                              |
| `HttpRoutingServiceId.ProcessorContract`       | A `Processor`                            |
| `HttpRoutingServiceId.UrlContract`             | A `Url`                                  |
| `HttpRoutingServiceId.RoutingResponseFactory`  | The routing response factory             |
| `HttpRoutingServiceId.HttpRoutingData`         | The collection's `HttpRoutingData`       |
| `HttpMiddlewareServiceId.*HandlerContract`     | One handler for each of the seven stages |

Note that `HttpServerServiceId.ExceptionResponseHandlerContract` is declared,
and no provider publishes it. `HttpRoutingServiceId.ListCommand` names the CLI
command that lists the routes, and `HttpRoutingCliRouteProvider` builds that
command instead of publishing it.

Like the Event and CLI components, the route collection publisher takes one of
two paths. In debug mode it walks every route provider and builds the data
again. Outside debug mode it loads the cached `HttpRoutingData`.

The routing CLI provider registers a `list` command for the routes. See
[Cli](../Cli/README.md).

## Exceptions

Each sub-component ships an abstract `…RuntimeException` and an abstract
`…InvalidArgumentException`, and its own concrete exceptions:

| Sub-component      | Concrete exceptions cover                                  |
| :----------------- | :--------------------------------------------------------- |
| `Message/Header`   | An invalid name, an invalid value, and an unsupported call |
| `Message/Request`  | An invalid method, a JSON callback, and a redirect status  |
| `Message/Response` | The response exceptions above                              |
| `Message/Stream`   | A read, a seek, a tell, and a write failure                |
| `Message/Uri`      | An invalid path, port, or query                            |
| `Message/File`     | Every uploaded file failure                                |
| `Routing`          | An invalid path, regex, parameter, or route name           |
| `Struct`           | The JSON request expectation                               |

See [Throwable](../Throwable/README.md) for the hierarchy.

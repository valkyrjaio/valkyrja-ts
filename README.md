<p align="center"><a href="https://valkyrja.io" target="_blank">
    <img src="https://raw.githubusercontent.com/valkyrjaio/art/refs/heads/26.x/long-banner/orange/typescript.png" width="100%">
</a></p>

# Valkyrja

[Valkyrja][Valkyrja url] is a TypeScript framework for web and console applications.

Valkyrja (pronounced "Valk-ear-ya") is the Old Norse spelling for Valkyrie, a
mythical creature that would guide warriors to Valhalla (the afterlife and a
better place) after death. In a similar sense, the Valkyrja framework guides
your application to be in a better state. Fast, light, and robust, Valkyrja
does the heavy lifting so you can focus on your application.

<p>
    <a href="https://www.npmjs.com/package/@valkyrjaio/valkyrja"><img src="https://img.shields.io/npm/v/@valkyrjaio/valkyrja.svg" alt="Latest Version on npm"></a>
    <a href="https://www.npmjs.com/package/@valkyrjaio/valkyrja"><img src="https://img.shields.io/node/v/@valkyrjaio/valkyrja.svg" alt="Supported Node.js Version"></a>
    <a href="https://github.com/valkyrjaio/valkyrja-ts/blob/26.x/LICENSE.md"><img src="https://img.shields.io/github/license/valkyrjaio/valkyrja-ts.svg" alt="License"></a>
    <a href="https://github.com/valkyrjaio/valkyrja-ts/actions/workflows/ci.yml?query=branch%3A26.x"><img src="https://github.com/valkyrjaio/valkyrja-ts/actions/workflows/ci.yml/badge.svg?branch=26.x" alt="CI Status"></a>
</p>

## What's Included

- **HTTP and CLI kernels** — unified application architecture serving both
  web requests and command-line invocations
- **Dependency injection container** — deferred bindings, contextual
  resolution, and child containers for fast resolution at runtime
- **Routing** — expressive HTTP and CLI route definitions with middleware,
  constraints, and reverse URL resolution
- **HTTP messages** — PSR-style requests, responses, streams, URIs, uploaded
  files, and headers
- **Event dispatcher** — decoupled event handling with typed listeners
- **Validation** — rule-based validation for input data

## Installation

### Start a New Application

The fastest way to start a new Valkyrja application is with the starter app or
the Sindri build tool:

- Use the [`valkyrja-starter-app-ts`][starter url] GitHub template ("Use this
  template" button on the repository page)
- Or use [Sindri][sindri url] to scaffold and build your project

### Add to an Existing Project

To install the framework as a dependency:

```
npm install @valkyrjaio/valkyrja
```

Import only what you need, by path:

```ts
import { Application } from '@valkyrjaio/valkyrja/Application/Kernel/Application.js';
```

## Documentation

Full [documentation][docs url] is available on the Valkyrja website.

## Ecosystem

Valkyrja is the core framework. Surrounding it is an ecosystem of related
projects in the Valkyrjaio organization:

- [**Sindri**][sindri url] — build tool and application creator
- [**Starter (App)**][starter url] — starter application for new projects

See the [Valkyrjaio organization page][org url] for the complete listing.

## Versioning and Release Process

Valkyrja follows [semantic versioning][semantic versioning url] with a major
release every year, and support for each major version for 2 years from the
date of release.

For more information see our
[Versioning and Release Process documentation][Versioning and Release Process url].

### Supported Versions

Bug fixes are provided until 3 months after the next major release. Security
fixes are provided for 2 years after the initial release.

| Version | Node | Release        | Bug Fixes Until | Security Fixes Until |
| :------ | :--- | :------------- | :-------------- | :------------------- |
| 26      | 22+  | March 31, 2026 | Q2 2027         | Q1 2028              |

## Contributing

Valkyrja is an open-source, community-driven project. Thank you for your
interest in helping develop, maintain, and release it.

See [`CONTRIBUTING.md`][contributing url] for the submission process and
[`VOCABULARY.md`][vocabulary url] for the terminology used across Valkyrja.

## Security Issues

If you discover a security vulnerability within Valkyrja, please follow our
[disclosure procedure][security vulnerabilities url].

## License

Valkyrja is open-source software licensed under the
[MIT license][MIT license url]. See [`LICENSE.md`](./LICENSE.md).

[Valkyrja url]: https://valkyrja.io
[org url]: https://github.com/valkyrjaio
[sindri url]: https://github.com/valkyrjaio/sindri-ts
[starter url]: https://github.com/valkyrjaio/valkyrja-starter-app-ts
[docs url]: https://valkyrja.io
[Versioning and Release Process url]: https://github.com/valkyrjaio/.github/blob/master/VERSIONING_AND_RELEASE_PROCESS.md
[contributing url]: https://github.com/valkyrjaio/.github/blob/26.x/CONTRIBUTING.md
[vocabulary url]: https://github.com/valkyrjaio/.github/blob/26.x/VOCABULARY.md
[security vulnerabilities url]: https://github.com/valkyrjaio/.github/blob/26.x/SECURITY.md
[semantic versioning url]: https://semver.org/
[MIT license url]: https://opensource.org/licenses/MIT
[license url]: ./LICENSE.md

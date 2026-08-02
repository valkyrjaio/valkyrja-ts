/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerResponse } from 'node:http';

/**
 * Capturing native {@link ServerResponse} double.
 *
 * The request handler writes the framework response back through the native
 * response (`statusCode`, `statusMessage`, `setHeader`, `end`). This fixture
 * records each of those so a test can assert on exactly what the entry point
 * emitted end to end, without binding a real socket — the TypeScript equivalent
 * of PHP's SAPI-output capture in the worker smoke fixtures.
 */
export class NodeServerResponseFixture {
    statusCode: number = 0;

    statusMessage: string = '';

    readonly headers: Record<string, string> = {};

    body: string = '';

    ended: boolean = false;

    setHeader(name: string, value: string): void {
        this.headers[name] = value;
    }

    end(body: string = ''): void {
        this.body = body;
        this.ended = true;
    }

    /**
     * View this fixture as a native {@link ServerResponse} for the entry points.
     */
    asServerResponse(): ServerResponse {
        return this as unknown as ServerResponse;
    }
}

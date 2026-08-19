/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerResponse } from 'node:http';

/**
 * Capturing native {@link ServerResponse} double that records what the entry point emitted.
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

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';

export interface NodeRequestSpec {
    url?: string;
    method?: string;
    httpVersion?: string;
    headers?: IncomingHttpHeaders;
    encrypted?: boolean;
}

/**
 * Builds a native {@link IncomingMessage} double for the request factory.
 */
export class NodeRequestFixture {
    static make(spec: NodeRequestSpec = {}): IncomingMessage {
        return {
            headers: spec.headers ?? {},
            url: spec.url ?? '/',
            method: spec.method ?? 'GET',
            httpVersion: spec.httpVersion ?? '1.1',
            socket: spec.encrypted === true ? { encrypted: true } : {},
        } as unknown as IncomingMessage;
    }
}

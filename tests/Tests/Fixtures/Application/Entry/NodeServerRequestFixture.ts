/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { IncomingMessage } from 'node:http';

/**
 * Builds a minimal native {@link IncomingMessage} double for driving the entry points without a live socket.
 */
export class NodeServerRequestFixture {
    static make(url: string = '/', method: string = 'GET'): IncomingMessage {
        return {
            headers: {},
            url,
            method,
            httpVersion: '1.1',
            socket: {},
        } as unknown as IncomingMessage;
    }
}

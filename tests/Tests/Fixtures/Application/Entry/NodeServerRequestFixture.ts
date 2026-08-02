/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { IncomingMessage } from 'node:http';

/**
 * Builds a minimal native {@link IncomingMessage} double for driving the entry
 * points without a live socket. Only the fields the request factory reads are
 * populated, so a request for any method/url can be produced in a single call.
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

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { IncomingMessage } from 'node:http';

import { describe, expect, it } from 'vitest';

import { Http } from '../../../../../src/Valkyrja/Application/Entry/Http.ts';
import { ServerRequest } from '../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';

// run() starts a long-lived HTTP server (deferred per the worker-loop testing rule);
// getRequest is the testable helper.
describe('Http', () => {
    it('getRequest builds a server request from a node request', () => {
        const nodeRequest = {
            headers: {},
            url: '/',
            method: 'GET',
            httpVersion: '1.1',
            socket: {},
        } as unknown as IncomingMessage;

        const request = Http.getRequest(nodeRequest);

        expect(request).toBeInstanceOf(ServerRequest);
    });
});

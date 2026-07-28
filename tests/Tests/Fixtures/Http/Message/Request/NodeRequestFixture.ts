/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
 *
 * Node's `IncomingMessage` is the TypeScript port's raw request input — the
 * counterpart to PHP's `$_SERVER` superglobal — so mapping fidelity is asserted
 * by handing the factory one of these and reading the resulting ServerRequest
 * back out. Only the fields the factory reads are populated, and every one of
 * them is settable so a single call can express any request shape.
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

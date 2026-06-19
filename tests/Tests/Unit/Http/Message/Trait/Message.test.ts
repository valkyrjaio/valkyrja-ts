/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ProtocolVersion } from '../../../../../../src/Valkyrja/Http/Message/Enum/ProtocolVersion.ts';
import { HeaderCollection } from '../../../../../../src/Valkyrja/Http/Message/Header/Collection/HeaderCollection.ts';
import { Header } from '../../../../../../src/Valkyrja/Http/Message/Header/Header.ts';
import { Stream } from '../../../../../../src/Valkyrja/Http/Message/Stream/Stream.ts';
import { Message } from '../../../../../../src/Valkyrja/Http/Message/Trait/Message.ts';

import type { HeaderCollectionContract } from '../../../../../../src/Valkyrja/Http/Message/Header/Collection/Contract/HeaderCollectionContract.ts';
import type { HeaderContract } from '../../../../../../src/Valkyrja/Http/Message/Header/Contract/HeaderContract.ts';
import type { StreamContract } from '../../../../../../src/Valkyrja/Http/Message/Stream/Contract/StreamContract.ts';

class TestMessage extends Message {
    constructor() {
        super();
        this.headers = new HeaderCollection();
        this.setBody(new Stream(''));
    }

    publicSetBody(body: StreamContract): void {
        this.setBody(body);
    }

    publicInjectHeader(
        header: HeaderContract,
        headers: HeaderCollectionContract,
        override = false,
    ): HeaderCollectionContract {
        return this.injectHeader(header, headers, override);
    }
}

describe('Message', () => {
    it('defaults to HTTP/1.1 and exposes the protocol version immutably', () => {
        const message = new TestMessage();

        expect(message.getProtocolVersion()).toBe(ProtocolVersion.V1_1);
        expect(message.withProtocolVersion(ProtocolVersion.V2).getProtocolVersion()).toBe(ProtocolVersion.V2);
    });

    it('exposes headers and body immutably and rewinds the body', () => {
        const message = new TestMessage();
        const headers = new HeaderCollection(new Header('Accept', 'text/html'));
        const body = new Stream('payload');
        body.read(3);

        expect(message.withHeaders(headers).getHeaders()).toBe(headers);

        const withBody = message.withBody(body);
        expect(withBody.getBody()).toBe(body);
        expect(withBody.getBody().getContents()).toBe('payload');
    });

    it('injects a header, overriding or merging with an existing one', () => {
        const message = new TestMessage();
        const base = new HeaderCollection(new Header('Accept', 'text/html'));

        const merged = message.publicInjectHeader(new Header('Accept', 'application/json'), base);
        expect(merged.get('Accept').getValues()).toStrictEqual(['text/html', 'application/json']);

        const overridden = Message.injectHeader(new Header('Accept', 'application/json'), base, true);
        expect(overridden.get('Accept').getValues()).toStrictEqual(['application/json']);

        const added = Message.injectHeader(new Header('Content-Type', 'text/plain'), base);
        expect(added.has('Content-Type')).toBe(true);
    });
});

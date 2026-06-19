/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Mode } from '../../../../../../src/Valkyrja/Http/Message/Stream/Enum/Mode.ts';
import { Stream } from '../../../../../../src/Valkyrja/Http/Message/Stream/Stream.ts';
import { HttpStreamInvalidLengthException } from '../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamInvalidLengthException.ts';
import { HttpStreamStreamSeekException } from '../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamStreamSeekException.ts';
import { HttpStreamStreamTellException } from '../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamStreamTellException.ts';
import { HttpStreamUnreadableStreamException } from '../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamUnreadableStreamException.ts';
import { HttpStreamUnseekableStreamException } from '../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamUnseekableStreamException.ts';
import { HttpStreamUnwritableStreamException } from '../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamUnwritableStreamException.ts';

describe('Stream', () => {
    it('reads its contents and reports its size', () => {
        const stream = new Stream('hello');

        expect(stream.getSize()).toBe(5);
        expect(stream.toString()).toBe('hello');
    });

    it('reads a fixed length and tracks the position', () => {
        const stream = new Stream('hello world');

        expect(stream.read(5)).toBe('hello');
        expect(stream.tell()).toBe(5);
        expect(stream.getContents()).toBe(' world');
        expect(stream.eof()).toBe(true);
    });

    it('throws when reading a negative length', () => {
        expect(() => new Stream('hello').read(-1)).toThrow(HttpStreamInvalidLengthException);
    });

    it('writes at the current position and returns the byte count', () => {
        const stream = new Stream('hello');
        stream.rewind();

        expect(stream.write('HE')).toBe(2);
        expect(stream.toString()).toBe('HEllo');
    });

    it('seeks with each whence and rejects out-of-range offsets', () => {
        const stream = new Stream('hello world');

        stream.seek(6);
        expect(stream.getContents()).toBe('world');

        stream.seek(0);
        stream.seek(2, 1);
        expect(stream.tell()).toBe(2);

        stream.seek(-1, 2);
        expect(stream.tell()).toBe(stream.getSize() - 1);

        expect(() => stream.seek(999)).toThrow(HttpStreamStreamSeekException);
    });

    it('exposes its metadata', () => {
        const stream = new Stream('hello');

        expect(stream.getMetadata()).toStrictEqual({ seekable: true, mode: Mode.WRITE_READ });
        expect(stream.getMetadataItem('seekable')).toBe(true);
        expect(stream.getMetadataItem('missing')).toBeNull();
    });

    it('detaches its buffer and then reports closed state', () => {
        const stream = new Stream('hello');

        expect(stream.detach()?.toString('utf8')).toBe('hello');
        expect(stream.detach()).toBeNull();
    });

    it('clears its state when closed', () => {
        const stream = new Stream('hello');
        stream.close();

        expect(stream.getSize()).toBe(0);
        expect(stream.eof()).toBe(true);
        expect(stream.isSeekable()).toBe(false);
        expect(stream.getMetadata()).toStrictEqual({});
        expect(() => stream.tell()).toThrow(HttpStreamStreamTellException);
        expect(() => stream.seek(0)).toThrow(HttpStreamUnseekableStreamException);
    });

    it('enforces read-only and write-only modes', () => {
        const readOnly = new Stream('hello', Mode.READ);
        expect(readOnly.isWritable()).toBe(false);
        expect(() => readOnly.write('x')).toThrow(HttpStreamUnwritableStreamException);

        const writeOnly = new Stream('hello', Mode.WRITE);
        expect(writeOnly.isReadable()).toBe(false);
        expect(() => writeOnly.read(1)).toThrow(HttpStreamUnreadableStreamException);
        expect(writeOnly.toString()).toBe('');
    });
});

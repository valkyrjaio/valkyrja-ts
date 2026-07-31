/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Metadata } from '../../../../../../src/Valkyrja/Grpc/Message/Metadata/Metadata.ts';
import { MetadataInvalidKeyException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/MetadataInvalidKeyException.ts';
import { MetadataInvalidValueException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/MetadataInvalidValueException.ts';

import type { MetadataValue } from '../../../../../../src/Valkyrja/Grpc/Message/Metadata/Contract/MetadataContract.ts';

describe('Metadata', () => {
    it('starts empty', () => {
        const metadata = new Metadata();

        expect(metadata.get('anything')).toBeNull();
        expect(metadata.getAll('anything')).toEqual([]);
        expect(metadata.has('anything')).toBe(false);
        expect([...metadata]).toEqual([]);
    });

    it('normalizes keys case-insensitively', () => {
        const metadata = new Metadata().with('Content-Type', 'application/grpc');

        expect(metadata.get('content-type')).toBe('application/grpc');
        expect(metadata.get('CONTENT-TYPE')).toBe('application/grpc');
        expect(metadata.has('Content-Type')).toBe(true);
        expect([...metadata.toMap().keys()]).toEqual(['content-type']);
    });

    it('seeds from an existing map', () => {
        const metadata = new Metadata(new Map<string, MetadataValue[]>([['X-Trace', ['a', 'b']]]));

        expect(metadata.getAll('x-trace')).toEqual(['a', 'b']);
        expect(metadata.get('x-trace')).toBe('a');
    });

    it('replaces every value for a key with with()', () => {
        const metadata = new Metadata().withAdded('x-trace', 'a').withAdded('x-trace', 'b').with('x-trace', 'c');

        expect(metadata.getAll('x-trace')).toEqual(['c']);
    });

    it('appends values with withAdded()', () => {
        const metadata = new Metadata().withAdded('x-trace', 'a').withAdded('x-trace', 'b');

        expect(metadata.getAll('x-trace')).toEqual(['a', 'b']);
    });

    it('removes a key with without()', () => {
        const metadata = new Metadata().with('x-trace', 'a').without('X-Trace');

        expect(metadata.has('x-trace')).toBe(false);
    });

    it('leaves the source untouched on every copy operation', () => {
        const original = new Metadata().with('x-trace', 'a');

        original.with('x-trace', 'b');
        original.withAdded('x-trace', 'c');
        original.without('x-trace');

        expect(original.getAll('x-trace')).toEqual(['a']);
    });

    it('returns a null first value for a key whose list is empty', () => {
        const metadata = new Metadata(new Map<string, MetadataValue[]>([['x-trace', []]]));

        expect(metadata.get('x-trace')).toBeNull();
        expect(metadata.has('x-trace')).toBe(true);
    });

    it('hands out copies of the value lists', () => {
        const metadata = new Metadata().with('x-trace', 'a');

        metadata.getAll('x-trace').push('b');
        metadata.toMap().set('x-other', ['c']);

        expect(metadata.getAll('x-trace')).toEqual(['a']);
        expect(metadata.has('x-other')).toBe(false);
    });

    it('identifies binary keys by their suffix', () => {
        const metadata = new Metadata();

        expect(metadata.isBinaryKey('trace-bin')).toBe(true);
        expect(metadata.isBinaryKey('TRACE-BIN')).toBe(true);
        expect(metadata.isBinaryKey('trace')).toBe(false);
    });

    it('carries bytes under a binary key', () => {
        const value = new Uint8Array([1, 2]);
        const metadata = new Metadata().with('trace-bin', value);

        expect(metadata.get('trace-bin')).toEqual(value);
    });

    it('iterates its entries', () => {
        const metadata = new Metadata().with('a', '1').with('b', '2');

        expect([...metadata]).toEqual([
            ['a', ['1']],
            ['b', ['2']],
        ]);
    });

    it.each([[''], ['bad key'], ['bad:key'], ['bad/key']])('rejects the invalid key %j', (key) => {
        expect(() => new Metadata().with(key, 'value')).toThrow(MetadataInvalidKeyException);
    });

    it('names the offending key when rejecting it', () => {
        expect(() => new Metadata().with('bad key', 'value')).toThrow("'bad key' is not a valid metadata key");
    });

    it('requires bytes under a binary key', () => {
        // A wrong value type can only arrive from untyped input, so the test has to construct it.
        expect(() => new Metadata().with('trace-bin', 'text')).toThrow(MetadataInvalidValueException);
        expect(() => new Metadata().with('trace-bin', 'text')).toThrow(
            "Binary metadata key 'trace-bin' requires a Uint8Array value, but got string.",
        );
    });

    it('requires a string under an ascii key', () => {
        expect(() => new Metadata().with('trace', new Uint8Array([1]) as unknown as string)).toThrow(
            MetadataInvalidValueException,
        );
        expect(() => new Metadata().with('trace', new Uint8Array([1]) as unknown as string)).toThrow(
            "ASCII metadata key 'trace' requires a string value, but got Uint8Array;",
        );
    });

    it('names a null or undefined value when rejecting it', () => {
        expect(() => new Metadata().with('trace', null as unknown as string)).toThrow('but got null;');
        expect(() => new Metadata().with('trace', undefined as unknown as string)).toThrow('but got undefined;');
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { MetadataInvalidKeyException } from '../../Throwable/Exception/MetadataInvalidKeyException.ts';
import { MetadataInvalidValueException } from '../../Throwable/Exception/MetadataInvalidValueException.ts';

import type { MetadataContract, MetadataValue } from './Contract/MetadataContract.ts';

export class Metadata implements MetadataContract {
    protected static readonly BINARY_SUFFIX = '-bin';

    /**
     * The gRPC metadata key charset, matched against the lower-cased key. It mirrors the set gRPC
     * enforces, so a key this accepts is one the transport accepts.
     */
    protected static readonly VALID_KEY = /^[a-z0-9._-]+$/;

    protected readonly values: Map<string, MetadataValue[]>;

    constructor(values: Map<string, MetadataValue[]> = new Map()) {
        const copy = new Map<string, MetadataValue[]>();

        for (const [rawKey, rawValues] of values) {
            const key = Metadata.normalize(rawKey);

            Metadata.validateKey(key);

            // Keys that differ only in case normalize to one key, so their values concatenate.
            const validated: MetadataValue[] = copy.get(key) ?? [];

            for (const value of rawValues) {
                Metadata.validateValue(key, value);
                validated.push(value);
            }

            copy.set(key, validated);
        }

        this.values = copy;
    }

    get(key: string): MetadataValue | null {
        const all = this.values.get(Metadata.normalize(key));

        return all === undefined || all.length === 0 ? null : (all[0] as MetadataValue);
    }

    getAll(key: string): MetadataValue[] {
        const all = this.values.get(Metadata.normalize(key));

        return all === undefined ? [] : [...all];
    }

    has(key: string): boolean {
        return this.values.has(Metadata.normalize(key));
    }

    isBinaryKey(key: string): boolean {
        return Metadata.normalize(key).endsWith(Metadata.BINARY_SUFFIX);
    }

    with(key: string, value: MetadataValue): MetadataContract {
        const copy = this.copyValues();

        copy.set(Metadata.normalize(key), [value]);

        return new Metadata(copy);
    }

    withAdded(key: string, value: MetadataValue): MetadataContract {
        const copy = this.copyValues();
        const normalized = Metadata.normalize(key);
        const existing = copy.get(normalized);

        if (existing === undefined) {
            copy.set(normalized, [value]);
        } else {
            existing.push(value);
        }

        return new Metadata(copy);
    }

    without(key: string): MetadataContract {
        const copy = this.copyValues();

        copy.delete(Metadata.normalize(key));

        return new Metadata(copy);
    }

    toMap(): Map<string, MetadataValue[]> {
        return this.copyValues();
    }

    [Symbol.iterator](): Iterator<[string, MetadataValue[]]> {
        return this.toMap()[Symbol.iterator]();
    }

    protected copyValues(): Map<string, MetadataValue[]> {
        const copy = new Map<string, MetadataValue[]>();

        for (const [key, values] of this.values) {
            copy.set(key, [...values]);
        }

        return copy;
    }

    protected static normalize(key: string): string {
        return key.toLowerCase();
    }

    /**
     * Reject a key that is not a valid gRPC header name, so a malformed key fails in the handler
     * rather than in the wire write.
     */
    protected static validateKey(normalizedKey: string): void {
        if (!Metadata.VALID_KEY.test(normalizedKey)) {
            throw new MetadataInvalidKeyException(
                `'${normalizedKey}' is not a valid metadata key; keys may contain only lowercase letters, digits, '-', '_', and '.'.`,
            );
        }
    }

    /**
     * Enforce the value union, so the wire write can trust the types: a `-bin` key carries bytes,
     * and every other key carries a string.
     */
    protected static validateValue(normalizedKey: string, value: MetadataValue): void {
        if (normalizedKey.endsWith(Metadata.BINARY_SUFFIX)) {
            if (!(value instanceof Uint8Array)) {
                throw new MetadataInvalidValueException(
                    `Binary metadata key '${normalizedKey}' requires a Uint8Array value, but got ${Metadata.typeName(value)}.`,
                );
            }
        } else if (typeof value !== 'string') {
            throw new MetadataInvalidValueException(
                `ASCII metadata key '${normalizedKey}' requires a string value, but got ${Metadata.typeName(value)}; use a '-bin' suffixed key to carry binary values.`,
            );
        }
    }

    protected static typeName(value: unknown): string {
        if (value === null || value === undefined) {
            return String(value);
        }

        return typeof value === 'object' ? value.constructor.name : typeof value;
    }
}

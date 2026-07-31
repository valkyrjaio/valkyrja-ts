/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * A metadata value: a string for an ASCII key, bytes for a `-bin` key.
 */
export type MetadataValue = string | Uint8Array;

/**
 * A case-insensitive multi-map of metadata keys to lists of string-or-binary values.
 *
 * Represents both HTTP/2 headers (request metadata, initial response metadata) and HTTP/2 trailing
 * headers (trailing response metadata). Keys ending in `-bin` carry binary values (base64-encoded
 * on the wire, decoded at the library boundary); all other keys carry string values.
 */
export interface MetadataContract extends Iterable<[string, MetadataValue[]]> {
    /** Get the first value for a key, or null if the key is absent. */
    get(key: string): MetadataValue | null;

    /** Get all values for a key; empty if the key is absent. */
    getAll(key: string): MetadataValue[];

    /** Whether the key is present. */
    has(key: string): boolean;

    /** Whether the key names a binary value (ends in `-bin`). */
    isBinaryKey(key: string): boolean;

    /** Return a copy with the key set to a single value, replacing any existing values. */
    with(key: string, value: MetadataValue): MetadataContract;

    /** Return a copy with the value appended to any existing values for the key. */
    withAdded(key: string, value: MetadataValue): MetadataContract;

    /** Return a copy with the key removed. */
    without(key: string): MetadataContract;

    /** Get a snapshot as a map of lower-cased keys to value lists. */
    toMap(): Map<string, MetadataValue[]>;
}

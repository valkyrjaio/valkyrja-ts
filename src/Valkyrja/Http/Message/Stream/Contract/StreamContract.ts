/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface StreamContract {
    toString(): string;
    close(): void;
    detach(): Buffer | null;
    getSize(): number;
    tell(): number;
    eof(): boolean;
    isSeekable(): boolean;
    seek(offset: number, whence?: number): void;
    rewind(): void;
    isWritable(): boolean;
    write(string: string): number;
    isReadable(): boolean;
    read(length: number): string;
    getContents(): string;
    getMetadata(): Record<string, unknown>;
    getMetadataItem(key: string): unknown;
}

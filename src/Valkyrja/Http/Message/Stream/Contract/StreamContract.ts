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
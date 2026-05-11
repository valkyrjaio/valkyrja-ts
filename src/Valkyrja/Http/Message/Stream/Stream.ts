import type { StreamContract } from './Contract/StreamContract.js';
import { Mode, modeIsReadable, modeIsWritable } from './Enum/Mode.js';
import { StreamFactory } from './Factory/StreamFactory.js';
import { HttpStreamInvalidLengthException } from './Throwable/Exception/HttpStreamInvalidLengthException.js';

export class Stream implements StreamContract {
    protected buffer: Buffer;
    protected position: number  = 0;
    protected closed: boolean   = false;

    constructor(
        protected content: string = '',
        protected mode: Mode = Mode.WRITE_READ,
    ) {
        this.buffer = Buffer.from(content, 'utf8');
        if (modeIsWritable(this.mode) && !modeIsReadable(this.mode)) {
            this.position = this.buffer.length;
        }
    }

    toString(): string {
        return StreamFactory.toString(this);
    }

    close(): void {
        this.closed  = true;
        this.buffer  = Buffer.alloc(0);
        this.position = 0;
    }

    detach(): Buffer | null {
        if (this.closed) {
            return null;
        }
        const buf    = this.buffer;
        this.closed  = true;
        this.buffer  = Buffer.alloc(0);
        this.position = 0;
        return buf;
    }

    getSize(): number {
        return this.buffer.length;
    }

    tell(): number {
        if (this.closed) {
            StreamFactory.verifyTellResult(false);
        }
        return this.position;
    }

    eof(): boolean {
        return this.closed || this.position >= this.buffer.length;
    }

    isSeekable(): boolean {
        return !this.closed;
    }

    seek(offset: number, whence: number = 0): void {
        StreamFactory.verifySeekable(this);
        let newPos: number;
        if (whence === 0) {
            newPos = offset;
        } else if (whence === 1) {
            newPos = this.position + offset;
        } else {
            newPos = this.buffer.length + offset;
        }
        if (newPos < 0 || newPos > this.buffer.length) {
            StreamFactory.verifySeekResult(-1);
        }
        this.position = newPos;
    }

    rewind(): void {
        this.seek(0);
    }

    isWritable(): boolean {
        return !this.closed && modeIsWritable(this.mode);
    }

    write(string: string): number {
        StreamFactory.verifyWritable(this);
        const chunk   = Buffer.from(string, 'utf8');
        const before  = this.buffer.slice(0, this.position);
        const after   = this.buffer.slice(this.position + chunk.length);
        this.buffer   = Buffer.concat([before, chunk, after]);
        this.position += chunk.length;
        return chunk.length;
    }

    isReadable(): boolean {
        return !this.closed && modeIsReadable(this.mode);
    }

    read(length: number): string {
        if (length < 0) {
            throw new HttpStreamInvalidLengthException(`Invalid length of ${length} provided. Length must be greater than 0`);
        }
        StreamFactory.verifyReadable(this);
        const chunk    = this.buffer.slice(this.position, this.position + length);
        this.position += chunk.length;
        return chunk.toString('utf8');
    }

    getContents(): string {
        StreamFactory.verifyReadable(this);
        const chunk    = this.buffer.slice(this.position);
        this.position  = this.buffer.length;
        return chunk.toString('utf8');
    }

    getMetadata(): Record<string, unknown> {
        if (this.closed) {
            return {};
        }
        return {
            seekable: this.isSeekable(),
            mode:     this.mode,
        };
    }

    getMetadataItem(key: string): unknown {
        return this.getMetadata()[key] ?? null;
    }
}
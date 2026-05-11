import type { StreamContract } from '../Contract/StreamContract.js';
import { HttpStreamStreamReadException } from '../Throwable/Exception/HttpStreamStreamReadException.js';
import { HttpStreamStreamSeekException } from '../Throwable/Exception/HttpStreamStreamSeekException.js';
import { HttpStreamStreamTellException } from '../Throwable/Exception/HttpStreamStreamTellException.js';
import { HttpStreamStreamWriteException } from '../Throwable/Exception/HttpStreamStreamWriteException.js';
import { HttpStreamUnreadableStreamException } from '../Throwable/Exception/HttpStreamUnreadableStreamException.js';
import { HttpStreamUnseekableStreamException } from '../Throwable/Exception/HttpStreamUnseekableStreamException.js';
import { HttpStreamUnwritableStreamException } from '../Throwable/Exception/HttpStreamUnwritableStreamException.js';

export abstract class StreamFactory {
    static isModeWriteable(mode: string): boolean {
        return mode.includes('x')
            || mode.includes('w')
            || mode.includes('c')
            || mode.includes('a')
            || mode.includes('+');
    }

    static isModeReadable(mode: string): boolean {
        return mode.includes('r') || mode.includes('+');
    }

    static toString(stream: StreamContract): string {
        if (!stream.isReadable()) {
            return '';
        }
        try {
            stream.rewind();
            return stream.getContents();
        } catch {
            return '';
        }
    }

    static verifyWritable(stream: StreamContract): void {
        if (!stream.isWritable()) {
            throw new HttpStreamUnwritableStreamException('Stream is not writable');
        }
    }

    static verifyWriteResult(result: number | false): asserts result is number {
        if (result === false) {
            throw new HttpStreamStreamWriteException('Error writing to stream');
        }
    }

    static verifySeekable(stream: StreamContract): void {
        if (!stream.isSeekable()) {
            throw new HttpStreamUnseekableStreamException('Stream is not seekable');
        }
    }

    static verifySeekResult(result: number): void {
        if (result !== 0) {
            throw new HttpStreamStreamSeekException('Error seeking within stream');
        }
    }

    static verifyReadable(stream: StreamContract): void {
        if (!stream.isReadable()) {
            throw new HttpStreamUnreadableStreamException('Stream is not readable');
        }
    }

    static verifyReadResult(result: string | false): asserts result is string {
        if (result === false) {
            throw new HttpStreamStreamReadException('Error reading stream');
        }
    }

    static verifyTellResult(result: number | false): asserts result is number {
        if (result === false) {
            throw new HttpStreamStreamTellException('Error occurred during tell operation');
        }
    }
}
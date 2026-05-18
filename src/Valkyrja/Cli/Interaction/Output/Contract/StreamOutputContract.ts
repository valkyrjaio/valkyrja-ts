import type { OutputContract } from './OutputContract.js';

export interface StreamOutputContract extends OutputContract {
    getStream(): NodeJS.WritableStream;
    withStream(stream: NodeJS.WritableStream): this;
}

export namespace StreamOutputContract {
    export function instanceOf(value: unknown): value is StreamOutputContract {
        return typeof value === 'object' && value !== null && 'getStream' in value;
    }
}

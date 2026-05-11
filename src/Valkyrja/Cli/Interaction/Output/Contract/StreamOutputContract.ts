import type { OutputContract } from './OutputContract.js';

export interface StreamOutputContract extends OutputContract {
    getStream(): NodeJS.WritableStream;
    withStream(stream: NodeJS.WritableStream): this;
}

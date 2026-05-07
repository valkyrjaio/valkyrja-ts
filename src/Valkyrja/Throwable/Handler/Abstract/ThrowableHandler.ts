import { createHash } from 'node:crypto';

import { type ThrowableHandlerContract } from '../Contract/ThrowableHandlerContract.js';

export abstract class ThrowableHandler implements ThrowableHandlerContract {
    static getTraceCode(error: Error): string {
        return createHash('md5').update(error.constructor.name + (error.stack ?? '')).digest('hex');
    }

    abstract enable(options?: { displayErrors?: boolean }): void;
}
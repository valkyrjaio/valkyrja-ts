import type { OutputContract } from './OutputContract.js';

export type PlainOutputContract = OutputContract;

export namespace PlainOutputContract {
    export function instanceOf(value: unknown): value is PlainOutputContract {
        return typeof value === 'object' && value !== null && 'getMessages' in value;
    }
}

import type { OutputContract } from './OutputContract.js';

export type EmptyOutputContract = OutputContract;

export namespace EmptyOutputContract {
    export function instanceOf(value: unknown): value is EmptyOutputContract {
        return typeof value === 'object' && value !== null && 'getMessages' in value;
    }
}

import type { OutputContract } from './OutputContract.js';

export interface FileOutputContract extends OutputContract {
    getFilepath(): string;
    withFilepath(filepath: string): this;
}

export namespace FileOutputContract {
    export function instanceOf(value: unknown): value is FileOutputContract {
        return typeof value === 'object' && value !== null && 'getFilepath' in value;
    }
}

import type { OutputContract } from './OutputContract.js';

export interface FileOutputContract extends OutputContract {
    getFilepath(): string;
    withFilepath(filepath: string): this;
}
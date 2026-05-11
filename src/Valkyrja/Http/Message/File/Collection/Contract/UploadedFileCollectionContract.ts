import type { UploadedFileContract } from '../../Contract/UploadedFileContract.js';

export interface UploadedFileCollectionContract {
    has(key: string): boolean;
    get(key: string): UploadedFileContract;
    getAll(): Record<string, UploadedFileContract>;
    getOnly(...keys: string[]): Record<string, UploadedFileContract>;
    getAllExcept(...keys: string[]): Record<string, UploadedFileContract>;
    with(collection: Record<string, UploadedFileContract>): this;
    withAdded(collection: Record<string, UploadedFileContract>): this;
}

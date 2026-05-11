import type { HeaderContract } from '../../Contract/HeaderContract.js';

export interface HeaderCollectionContract {
    has(name: string): boolean;
    get(name: string): HeaderContract;
    getHeaderLine(name: string): string;
    getAll(): Record<string, HeaderContract>;
    getOnly(...names: string[]): Record<string, HeaderContract>;
    getAllExcept(...names: string[]): Record<string, HeaderContract>;
    withHeader(header: HeaderContract): this;
    withoutHeader(name: string): this;
    withHeaders(...headers: HeaderContract[]): this;
    withAddedHeaders(...headers: HeaderContract[]): this;
}

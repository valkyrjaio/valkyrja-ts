import type { StructContract } from '../../Contract/StructContract.js';

export interface ResponseStructContract extends StructContract {
    getStructuredData(data: Record<string, unknown>, includeAll?: boolean): Record<string | number, unknown>;
}
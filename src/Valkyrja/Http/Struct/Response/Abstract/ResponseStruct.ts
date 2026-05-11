import type { ResponseStructContract } from '../Contract/ResponseStructContract.js';

export abstract class ResponseStruct implements ResponseStructContract {
    abstract readonly name: string;
    abstract readonly value: unknown;

    constructor(protected readonly fields: Record<string, string | number>) {}

    getStructuredData(data: Record<string, unknown>, includeAll: boolean = true): Record<string | number, unknown> {
        const structured: Record<string | number, unknown> = {};

        for (const [key, value] of Object.entries(this.fields)) {
            if (!includeAll && !(key in data)) {
                continue;
            }

            structured[value] = data[key] ?? null;
        }

        return structured;
    }
}

export interface FormatContract {
    getSetCode(): string;
    withSetCode(setCode: string): this;
    getUnsetCode(): string;
    withUnsetCode(unsetCode: string): this;
}

export namespace FormatContract {
    export function instanceOf(value: unknown): value is FormatContract {
        return typeof value === 'object' && value !== null && 'getSetCode' in value;
    }
}

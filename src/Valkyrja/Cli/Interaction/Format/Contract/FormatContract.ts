export interface FormatContract {
    getSetCode(): string;
    withSetCode(setCode: string): this;
    getUnsetCode(): string;
    withUnsetCode(unsetCode: string): this;
}
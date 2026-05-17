export interface ArgumentContract {
    getValue(): string;
    withValue(value: string): this;
}

export namespace ArgumentContract {
    export function instanceOf(value: unknown): value is ArgumentContract {
        return typeof value === 'object' && value !== null && 'getValue' in value;
    }
}

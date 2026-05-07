export interface ArgumentContract {
    getValue(): string;
    withValue(value: string): this;
}
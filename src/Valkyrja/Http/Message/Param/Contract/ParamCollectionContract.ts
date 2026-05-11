export interface ParamCollectionContract<V = unknown> {
    has(key: string): boolean;
    get(key: string): V | undefined;
    getAll(): Record<string, V>;
    getOnly(...keys: string[]): Record<string, V>;
    getAllExcept(...keys: string[]): Record<string, V>;
    with(params: Record<string, V>): this;
    withAdded(params: Record<string, V>): this;
}
import type { ParamCollectionContract } from '../Contract/ParamCollectionContract.js';

export abstract class ParamCollection<V = unknown> implements ParamCollectionContract<V> {
    protected params: Record<string, V>;

    constructor(params: Record<string, V> = {} as Record<string, V>) {
        this.params = params;
    }

    has(key: string): boolean {
        return key in this.params;
    }

    get(key: string): V | undefined {
        return this.params[key];
    }

    getAll(): Record<string, V> {
        return { ...this.params };
    }

    getOnly(...keys: string[]): Record<string, V> {
        const result: Record<string, V> = {};
        for (const [k, v] of Object.entries(this.params)) {
            if (keys.includes(k)) {
                result[k] = v;
            }
        }
        return result;
    }

    getAllExcept(...keys: string[]): Record<string, V> {
        const result: Record<string, V> = {};
        for (const [k, v] of Object.entries(this.params)) {
            if (!keys.includes(k)) {
                result[k] = v;
            }
        }
        return result;
    }

    with(params: Record<string, V>): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.params = params;
        return clone;
    }

    withAdded(params: Record<string, V>): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.params = { ...this.params, ...params };
        return clone;
    }
}

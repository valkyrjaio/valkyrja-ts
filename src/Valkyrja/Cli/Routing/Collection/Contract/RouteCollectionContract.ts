import type { CliRoutingData } from '../../Data/CliRoutingData.js';
import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface RouteCollectionContract {
    getData(): CliRoutingData;
    setFromData(data: CliRoutingData): void;
    add(...commands: RouteContract[]): this;
    get(name: string): RouteContract;
    has(name: string): boolean;
    all(): Record<string, RouteContract>;
}

export namespace RouteCollectionContract {
    export function instanceOf(value: unknown): value is RouteCollectionContract {
        return typeof value === 'object' && value !== null && 'getData' in value;
    }
}

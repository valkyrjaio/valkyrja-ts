import type { RouteContract } from './Contract/RouteContract.js';

export class CliRoutingData {
    constructor(
        public readonly routes: Record<string, () => RouteContract> = {},
    ) {}
}

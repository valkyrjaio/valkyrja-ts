import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface ProcessorContract {
    route(route: RouteContract): RouteContract;
}
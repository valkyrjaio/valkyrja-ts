import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface RouteCollectorContract {
    getRoutes(...classes: Array<new (...args: unknown[]) => unknown>): RouteContract[];
}
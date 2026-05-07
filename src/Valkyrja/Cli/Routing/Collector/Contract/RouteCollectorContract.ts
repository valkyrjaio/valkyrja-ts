import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface RouteCollectorContract {
    getRoutes(...classes: (new (...args: unknown[]) => unknown)[]): RouteContract[];
}
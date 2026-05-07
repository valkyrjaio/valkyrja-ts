import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface CliRouteProviderContract {}

export interface CliRouteProviderConstructor {
    new(): CliRouteProviderContract;
    getRoutes(): RouteContract[];
}
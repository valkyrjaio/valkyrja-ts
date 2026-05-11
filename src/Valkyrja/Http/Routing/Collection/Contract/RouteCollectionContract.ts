import type { RequestMethod } from '../../../Message/Enum/RequestMethod.js';
import type { DynamicRouteContract } from '../../Data/Contract/DynamicRouteContract.js';
import type { RouteContract } from '../../Data/Contract/RouteContract.js';
import type { HttpRoutingData } from '../../Data/HttpRoutingData.js';

export interface RouteCollectionContract {
    getData(): HttpRoutingData;
    setFromData(data: HttpRoutingData): void;
    add(route: RouteContract): void;
    hasPath(path: string, method: RequestMethod): boolean;
    getByPath(path: string, method: RequestMethod): RouteContract;
    hasRegex(regex: string, method: RequestMethod): boolean;
    getByRegex(regex: string, method: RequestMethod): DynamicRouteContract;
    getPaths(method: RequestMethod): Record<string, string>;
    getRegexes(method: RequestMethod): Record<string, string>;
    hasName(name: string): boolean;
    getByName(name: string): RouteContract;
    getAll(method: RequestMethod): Record<string, RouteContract>;
}

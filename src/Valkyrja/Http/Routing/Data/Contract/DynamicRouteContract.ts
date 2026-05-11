import type { ParameterContract } from './ParameterContract.js';
import type { RouteContract } from './RouteContract.js';

export interface DynamicRouteContract extends RouteContract {
    getRegex(): string;
    withRegex(regex: string): this;
    getParameters(): ParameterContract[];
    withParameters(...parameters: ParameterContract[]): this;
    withAddedParameters(...parameters: ParameterContract[]): this;
}

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface RouterContract {
    dispatch(request: ServerRequestContract): ResponseContract;
    dispatchRoute(request: ServerRequestContract, route: RouteContract): ResponseContract;
}
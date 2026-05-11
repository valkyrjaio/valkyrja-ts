import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseFactoryContract } from '../../Message/Response/Factory/Contract/ResponseFactoryContract.js';

export abstract class Controller {
    constructor(
        protected request: ServerRequestContract,
        protected responseFactory: ResponseFactoryContract,
    ) {}
}
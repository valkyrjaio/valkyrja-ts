import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RequestHandlerContract } from './RequestHandlerContract.js';

export interface ExceptionResponseRequestHandlerContract extends RequestHandlerContract {
    createResponseFromException(exception: Error): ResponseContract;
}

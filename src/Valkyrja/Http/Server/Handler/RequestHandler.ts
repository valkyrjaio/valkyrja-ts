import { ServerResponse } from 'node:http';

import { Container } from '../../../../Container/Manager/Container.js';
import { StatusCode } from '../../../Message/Enum/StatusCode.js';
import { Response } from '../../../Message/Response/Response.js';
import { Stream } from '../../../Message/Stream/Stream.js';
import { HttpResponseException } from '../../../Message/Throwable/Exception/HttpResponseException.js';
import { RequestReceivedHandler } from '../../../Middleware/Handler/RequestReceivedHandler.js';
import { SendingResponseHandler } from '../../../Middleware/Handler/SendingResponseHandler.js';
import { TerminatedHandler } from '../../../Middleware/Handler/TerminatedHandler.js';
import { ThrowableCaughtHandler } from '../../../Middleware/Handler/ThrowableCaughtHandler.js';
import { Router } from '../../../Routing/Dispatcher/Router.js';

import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.js';
import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RequestReceivedHandlerContract } from '../../../Middleware/Handler/Contract/RequestReceivedHandlerContract.js';
import type { SendingResponseHandlerContract } from '../../../Middleware/Handler/Contract/SendingResponseHandlerContract.js';
import type { TerminatedHandlerContract } from '../../../Middleware/Handler/Contract/TerminatedHandlerContract.js';
import type { ThrowableCaughtHandlerContract } from '../../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.js';
import type { RouterContract } from '../../../Routing/Dispatcher/Contract/RouterContract.js';
import type { RequestHandlerContract } from './Contract/RequestHandlerContract.js';

export class RequestHandler implements RequestHandlerContract {
    constructor(
        protected container: ContainerContract                            = new Container(),
        protected router: RouterContract                                  = new Router(),
        protected requestReceivedHandler: RequestReceivedHandlerContract  = new RequestReceivedHandler(),
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract  = new ThrowableCaughtHandler(),
        protected sendingResponseHandler: SendingResponseHandlerContract   = new SendingResponseHandler(),
        protected terminatedHandler: TerminatedHandlerContract            = new TerminatedHandler(),
        protected debug: boolean                                          = false,
    ) {}

    handle(request: ServerRequestContract): ResponseContract {
        let response: ResponseContract;

        try {
            response = this.dispatchRouter(request);
        } catch (throwable) {
            const error = throwable instanceof Error ? throwable : new Error(String(throwable));

            response = this.getResponseFromThrowable(error);
            response = this.throwableCaughtHandler.throwableCaught(request, response, error);
        }

        this.container.setSingleton(Response.name, response);

        return response;
    }

    send(response: ResponseContract, nodeResponse: ServerResponse): this {
        const statusCode = response.getStatusCode();

        nodeResponse.statusCode    = statusCode.value as number;
        nodeResponse.statusMessage = response.getReasonPhrase();

        const headers = response.getHeaders().getAll();

        for (const header of Object.values(headers)) {
            nodeResponse.setHeader(header.getName(), header.getHeaderLine());
        }

        const body = response.getBody();
        body.rewind();
        nodeResponse.end(body.getContents());

        return this;
    }

    terminate(request: ServerRequestContract, response: ResponseContract): void {
        this.terminatedHandler.terminated(request, response);
    }

    run(request: ServerRequestContract, nodeResponse: ServerResponse): void {
        let response = this.handle(request);

        response = this.sendingResponseHandler.sendingResponse(request, response);

        this.container.setSingleton(Response.name, response);

        this.send(response, nodeResponse);
        this.terminate(request, response);
    }

    protected dispatchRouter(request: ServerRequestContract): ResponseContract {
        this.container.setSingleton(request.constructor.name, request);

        const requestAfterMiddleware = this.requestReceivedHandler.requestReceived(request);

        if (!('getPath' in requestAfterMiddleware)) {
            return requestAfterMiddleware as ResponseContract;
        }

        const updatedRequest = requestAfterMiddleware as ServerRequestContract;

        this.container.setSingleton(updatedRequest.constructor.name, updatedRequest);

        return this.router.dispatch(updatedRequest);
    }

    protected getResponseFromThrowable(throwable: Error): ResponseContract {
        if (this.debug) {
            throw throwable;
        }

        if (throwable instanceof HttpResponseException) {
            return throwable.getResponse() ?? this.getDefaultErrorResponseForHttpException(throwable);
        }

        return this.getDefaultErrorResponse();
    }

    protected getDefaultErrorResponse(): ResponseContract {
        const body = new Stream();
        body.write('Unknown Server Error Occurred');
        body.rewind();

        return new Response(body, StatusCode.INTERNAL_SERVER_ERROR);
    }

    protected getDefaultErrorResponseForHttpException(httpException: HttpResponseException): ResponseContract {
        const statusCode = httpException.getStatusCode();
        const body       = new Stream();

        body.write('Unknown Server Error Occurred - ' + httpException.getTraceCode());
        body.rewind();

        return new Response(body, statusCode);
    }
}
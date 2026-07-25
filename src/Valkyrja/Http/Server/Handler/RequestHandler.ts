/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ServerResponse } from 'node:http';

import { Container } from '../../../Container/Manager/Container.ts';
import { StatusCode } from '../../Message/Enum/StatusCode.ts';
import { HttpMessageServiceId } from '../../Message/Constant/HttpMessageServiceId.ts';
import { Response } from '../../Message/Response/Response.ts';
import { Stream } from '../../Message/Stream/Stream.ts';
import { HttpResponseException } from '../../Message/Throwable/Exception/HttpResponseException.ts';
import { RequestReceivedHandler } from '../../Middleware/Handler/RequestReceivedHandler.ts';
import { SendingResponseHandler } from '../../Middleware/Handler/SendingResponseHandler.ts';
import { ResponseSentHandler } from '../../Middleware/Handler/ResponseSentHandler.ts';
import { ThrowableCaughtHandler } from '../../Middleware/Handler/ThrowableCaughtHandler.ts';
import { Router } from '../../Routing/Dispatcher/Router.ts';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { RequestReceivedHandlerContract } from '../../Middleware/Handler/Contract/RequestReceivedHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../../Middleware/Handler/Contract/SendingResponseHandlerContract.ts';
import type { ResponseSentHandlerContract } from '../../Middleware/Handler/Contract/ResponseSentHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouterContract } from '../../Routing/Dispatcher/Contract/RouterContract.ts';
import type { RequestHandlerContract } from './Contract/RequestHandlerContract.ts';

export class RequestHandler implements RequestHandlerContract {
    constructor(
        protected container: ContainerContract = new Container(),
        protected router: RouterContract = new Router(),
        protected requestReceivedHandler: RequestReceivedHandlerContract = new RequestReceivedHandler(),
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract = new ThrowableCaughtHandler(),
        protected sendingResponseHandler: SendingResponseHandlerContract = new SendingResponseHandler(),
        protected responseSentHandler: ResponseSentHandlerContract = new ResponseSentHandler(),
        protected debug: boolean = false,
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

        nodeResponse.statusCode = statusCode;
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
        this.responseSentHandler.responseSent(request, response);
    }

    run(request: ServerRequestContract, nodeResponse: ServerResponse): void {
        let response = this.handle(request);

        response = this.sendingResponseHandler.sendingResponse(request, response);

        this.container.setSingleton(Response.name, response);

        this.send(response, nodeResponse);
        this.terminate(request, response);
    }

    protected dispatchRouter(request: ServerRequestContract): ResponseContract {
        this.container.setSingleton(HttpMessageServiceId.ServerRequestContract, request);

        const requestAfterMiddleware = this.requestReceivedHandler.requestReceived(request);

        if (!('getPath' in requestAfterMiddleware)) {
            return requestAfterMiddleware as ResponseContract;
        }

        const updatedRequest = requestAfterMiddleware as ServerRequestContract;

        this.container.setSingleton(HttpMessageServiceId.ServerRequestContract, updatedRequest);

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
        const body = new Stream();

        body.write('Unknown Server Error Occurred - ' + httpException.getTraceCode());
        body.rewind();

        return new Response(body, statusCode);
    }
}

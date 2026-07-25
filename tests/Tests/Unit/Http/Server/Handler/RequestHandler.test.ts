/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { StatusCode } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { Header } from '../../../../../../src/Valkyrja/Http/Message/Header/Header.ts';
import { HeaderCollection } from '../../../../../../src/Valkyrja/Http/Message/Header/Collection/HeaderCollection.ts';
import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { HttpResponseException } from '../../../../../../src/Valkyrja/Http/Message/Throwable/Exception/HttpResponseException.ts';
import { RequestHandler } from '../../../../../../src/Valkyrja/Http/Server/Handler/RequestHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';
import type { RequestReceivedHandlerContract } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/Contract/RequestReceivedHandlerContract.ts';
import type { RouterContract } from '../../../../../../src/Valkyrja/Http/Routing/Dispatcher/Contract/RouterContract.ts';

// A request object that the handler treats as a request (it exposes getPath).
const request = { getPath: () => '/' } as unknown as ServerRequestContract;

const passRequestReceived = {
    requestReceived: (req: ServerRequestContract): ServerRequestContract => req,
} as RequestReceivedHandlerContract;

function build(overrides: {
    router?: RouterContract;
    requestReceivedHandler?: RequestReceivedHandlerContract;
    debug?: boolean;
}): { handler: RequestHandler } {
    const handler = new RequestHandler(
        new Container(),
        overrides.router ?? ({ dispatch: () => new Response() } as unknown as RouterContract),
        overrides.requestReceivedHandler ?? passRequestReceived,
        { throwableCaught: (_r, response) => response } as never,
        { sendingResponse: (_r, response) => response } as never,
        { responseSent: vi.fn() } as never,
        overrides.debug ?? false,
    );

    return { handler };
}

describe('RequestHandler', () => {
    it('dispatches the router and returns the response', () => {
        const response = new Response();
        const { handler } = build({ router: { dispatch: () => response } as unknown as RouterContract });

        expect(handler.handle(request)).toBe(response);
    });

    it('returns an early response from request-received middleware', () => {
        const earlyResponse = new Response();
        const dispatch = vi.fn();
        const { handler } = build({
            router: { dispatch } as unknown as RouterContract,
            requestReceivedHandler: { requestReceived: (): ResponseContract => earlyResponse } as never,
        });

        expect(handler.handle(request)).toBe(earlyResponse);
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('builds a 500 response for an unexpected throwable', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw new Error('boom');
                },
            } as unknown as RouterContract,
        });

        expect(handler.handle(request).getStatusCode()).toBe(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('wraps a non-Error throwable in an Error', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw 'a plain string failure';
                },
            } as unknown as RouterContract,
        });

        expect(handler.handle(request).getStatusCode()).toBe(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('uses the response carried by an HttpResponseException', () => {
        const carried = new Response(undefined, StatusCode.NOT_FOUND);
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw new HttpResponseException(StatusCode.NOT_FOUND, 'nf', null, carried);
                },
            } as unknown as RouterContract,
        });

        expect(handler.handle(request).getStatusCode()).toBe(StatusCode.NOT_FOUND);
    });

    it('builds a default error response for an HttpResponseException without a response', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw new HttpResponseException(StatusCode.BAD_REQUEST, 'bad');
                },
            } as unknown as RouterContract,
        });

        expect(handler.handle(request).getStatusCode()).toBe(StatusCode.BAD_REQUEST);
    });

    it('rethrows in debug mode', () => {
        const { handler } = build({
            debug: true,
            router: {
                dispatch: () => {
                    throw new Error('boom');
                },
            } as unknown as RouterContract,
        });

        expect(() => handler.handle(request)).toThrow('boom');
    });

    it('writes the response to a node response when sending', () => {
        const { handler } = build({});
        const response = new Response(undefined, StatusCode.OK, new HeaderCollection(new Header('X-Test', 'value')));
        const nodeResponse = { statusCode: 0, statusMessage: '', setHeader: vi.fn(), end: vi.fn() };

        handler.send(response, nodeResponse as never);

        expect(nodeResponse.statusCode).toBe(StatusCode.OK);
        expect(nodeResponse.setHeader).toHaveBeenCalledWith('X-Test', 'value');
        expect(nodeResponse.end).toHaveBeenCalledTimes(1);
    });

    it('runs the full request lifecycle', () => {
        const responseSent = vi.fn();
        const response = new Response();
        const handler = new RequestHandler(
            new Container(),
            { dispatch: () => response } as unknown as RouterContract,
            passRequestReceived,
            { throwableCaught: (_r: ServerRequestContract, r: ResponseContract) => r } as never,
            { sendingResponse: (_r: ServerRequestContract, r: ResponseContract) => r } as never,
            { responseSent } as never,
        );
        const nodeResponse = { statusCode: 0, statusMessage: '', setHeader: vi.fn(), end: vi.fn() };

        handler.run(request, nodeResponse as never);

        expect(nodeResponse.end).toHaveBeenCalledTimes(1);
        expect(responseSent).toHaveBeenCalledTimes(1);
    });
});

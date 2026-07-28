/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { HttpMiddlewareServiceId } from '../../../../../../src/Valkyrja/Http/Middleware/Constant/HttpMiddlewareServiceId.ts';
import { RequestReceivedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RequestReceivedHandler.ts';
import { ResponseSentHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/ResponseSentHandler.ts';
import { SendingResponseHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/SendingResponseHandler.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/ThrowableCaughtHandler.ts';
import { HttpRoutingServiceId } from '../../../../../../src/Valkyrja/Http/Routing/Constant/HttpRoutingServiceId.ts';
import { Router } from '../../../../../../src/Valkyrja/Http/Routing/Dispatcher/Router.ts';
import { HttpServerServiceId } from '../../../../../../src/Valkyrja/Http/Server/Constant/HttpServerServiceId.ts';
import { RequestHandler } from '../../../../../../src/Valkyrja/Http/Server/Handler/RequestHandler.ts';
import { HttpServerServiceProvider } from '../../../../../../src/Valkyrja/Http/Server/Provider/HttpServerServiceProvider.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

function containerWithDependencies(): Container {
    const container = new Container();

    container.setSingleton(ApplicationServiceId.ApplicationContract, {
        getDebugMode: () => true,
    } as unknown as ApplicationContract);
    container.setSingleton(HttpRoutingServiceId.RouterContract, new Router(container));
    container.setSingleton(
        HttpMiddlewareServiceId.RequestReceivedHandlerContract,
        new RequestReceivedHandler(container),
    );
    container.setSingleton(
        HttpMiddlewareServiceId.ThrowableCaughtHandlerContract,
        new ThrowableCaughtHandler(container),
    );
    container.setSingleton(
        HttpMiddlewareServiceId.SendingResponseHandlerContract,
        new SendingResponseHandler(container),
    );
    container.setSingleton(HttpMiddlewareServiceId.ResponseSentHandlerContract, new ResponseSentHandler(container));

    return container;
}

describe('HttpServerServiceProvider', () => {
    it('publishes the request handler id', () => {
        const publishers = new HttpServerServiceProvider().publishers();

        expect(HttpServerServiceId.RequestHandlerContract in publishers).toBe(true);
    });

    it('publishRequestHandler registers a request handler singleton', () => {
        const container = containerWithDependencies();

        HttpServerServiceProvider.publishRequestHandler(container);

        expect(container.getSingleton(HttpServerServiceId.RequestHandlerContract)).toBeInstanceOf(RequestHandler);
    });
});

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../../../../src/Valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';
import type { GrpcConfigContract } from '../../../../src/Valkyrja/Application/Data/Contract/GrpcConfigContract.ts';
import type { CallReceivedMiddlewareContract } from '../../../../src/Valkyrja/Grpc/Middleware/Contract/CallReceivedMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../../../src/Valkyrja/Grpc/Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteNotMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../../../src/Valkyrja/Grpc/Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../../../src/Valkyrja/Grpc/Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';

/**
 * A gRPC config for tests, standing in for the concrete `GrpcConfig`.
 *
 * Every middleware list defaults empty so a test opts into exactly the stages it cares about.
 */
export class GrpcConfigFixture implements GrpcConfigContract {
    constructor(
        public readonly namespace: string = 'App',
        public readonly dir: string = process.cwd(),
        public readonly version: string = '1.0.0',
        public readonly environment: string = 'production',
        public readonly debugMode: boolean = false,
        public readonly timezone: string = 'UTC',
        public readonly key: string = 'some_secret_app_key',
        public readonly dataPath: string = 'App/Provider/Data',
        public readonly dataNamespace: string = 'App/Provider/Data',
        public readonly port: number = 50051,
        public readonly maxInboundMessages: number = 1000,
        public readonly providers: ComponentProviderContract[] = [],
        public readonly callbacks: ((app: ApplicationContract) => void)[] = [],
        public readonly callReceivedMiddleware: Array<new (...args: unknown[]) => CallReceivedMiddlewareContract> = [],
        public readonly routeMatchedMiddleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract> = [],
        public readonly routeNotMatchedMiddleware: Array<
            new (...args: unknown[]) => RouteNotMatchedMiddlewareContract
        > = [],
        public readonly routeDispatchedMiddleware: Array<
            new (...args: unknown[]) => RouteDispatchedMiddlewareContract
        > = [],
        public readonly throwableCaughtMiddleware: Array<
            new (...args: unknown[]) => ThrowableCaughtMiddlewareContract
        > = [],
        public readonly sendingResponseMiddleware: Array<
            new (...args: unknown[]) => SendingResponseMiddlewareContract
        > = [],
        public readonly responseSentMiddleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract> = [],
    ) {}
}

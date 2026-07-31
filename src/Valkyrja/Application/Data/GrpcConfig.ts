/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationInfo } from '../Constant/ApplicationInfo.ts';
import { ApplicationServiceId } from '../Constant/ApplicationServiceId.ts';
import { GrpcApplicationComponentProvider } from '../Provider/GrpcApplicationComponentProvider.ts';
import { DEFAULT_MAX_INBOUND_MESSAGES } from './Contract/GrpcConfigContract.ts';

import type { CallReceivedMiddlewareContract } from '../../Grpc/Middleware/Contract/CallReceivedMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Grpc/Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Grpc/Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Grpc/Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../../Grpc/Middleware/Contract/RouteNotMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Grpc/Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Grpc/Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.ts';
import type { GrpcConfigContract } from './Contract/GrpcConfigContract.ts';

export class GrpcConfig implements GrpcConfigContract {
    static readonly id = ApplicationServiceId.GrpcConfigContract;

    constructor(
        public readonly namespace: string = 'App',
        public readonly dir: string = process.cwd(),
        public readonly version: string = ApplicationInfo.VERSION,
        public readonly environment: string = 'production',
        public readonly debugMode: boolean = false,
        public readonly timezone: string = 'UTC',
        public readonly key: string = 'some_secret_app_key',
        public readonly dataPath: string = 'App/Provider/Data',
        public readonly dataNamespace: string = 'App/Provider/Data',
        public readonly port: number = 50051,
        public readonly maxInboundMessages: number = DEFAULT_MAX_INBOUND_MESSAGES,
        public readonly providers: ComponentProviderContract[] = [new GrpcApplicationComponentProvider()],
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

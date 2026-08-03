/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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

/** A gRPC config for tests, standing in for the concrete `GrpcConfig`. */
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

    /** A config carrying the given component providers, with every other field left at its default. */
    static withProviders(...providers: ComponentProviderContract[]): GrpcConfigFixture {
        return GrpcConfigFixture.withDebugMode(false, ...providers);
    }

    /**
     * A config in the given debug mode, carrying the given component providers.
     *
     * `debugMode` decides whether the routing provider walks the route providers or reads the
     * generated data, so a test that covers both paths sets it at construction — the field is
     * readonly, and a cast to defeat that would be a needless deviation.
     */
    static withDebugMode(debugMode: boolean, ...providers: ComponentProviderContract[]): GrpcConfigFixture {
        return new GrpcConfigFixture(
            'App',
            process.cwd(),
            '1.0.0',
            'production',
            debugMode,
            'UTC',
            'some_secret_app_key',
            'App/Provider/Data',
            'App/Provider/Data',
            50051,
            1000,
            providers,
        );
    }
}

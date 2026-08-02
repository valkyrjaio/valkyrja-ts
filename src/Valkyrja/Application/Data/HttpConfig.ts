/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ApplicationInfo } from '../Constant/ApplicationInfo.ts';
import { ApplicationServiceId } from '../Constant/ApplicationServiceId.ts';
import { HttpApplicationComponentProvider } from '../Provider/HttpApplicationComponentProvider.ts';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.ts';
import type { HttpConfigContract } from './Contract/HttpConfigContract.ts';

export class HttpConfig implements HttpConfigContract {
    static readonly id = ApplicationServiceId.HttpConfigContract;

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
        public readonly providers: ComponentProviderContract[] = [new HttpApplicationComponentProvider()],
        public readonly callbacks: ((app: ApplicationContract) => void)[] = [],
        public readonly requestReceivedMiddleware: string[] = [],
        public readonly routeMatchedMiddleware: string[] = [],
        public readonly routeNotMatchedMiddleware: string[] = [],
        public readonly routeDispatchedMiddleware: string[] = [],
        public readonly throwableCaughtMiddleware: string[] = [],
        public readonly sendingResponseMiddleware: string[] = [],
        public readonly responseSentMiddleware: string[] = [],
    ) {}
}

import { ApplicationInfo } from '../Constant/ApplicationInfo.js';
import { ApplicationServiceId } from '../Constant/ApplicationServiceId.js';
import { HttpApplicationComponentProvider } from '../Provider/HttpApplicationComponentProvider.js';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.js';
import type { HttpConfigContract } from './Contract/HttpConfigContract.js';

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
        public readonly terminatedMiddleware: string[] = [],
    ) {}
}

import { ApplicationInfo } from '../Constant/ApplicationInfo.js';
import { ApplicationComponentProvider } from '../Provider/ApplicationComponentProvider.js';
import { ApplicationServiceId } from '../Constant/ApplicationServiceId.js';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderConstructor } from '../Provider/Contract/ComponentProviderContract.js';
import type { ConfigContract } from './Contract/ConfigContract.js';

export class Config implements ConfigContract {
    static readonly id = ApplicationServiceId.Config;

    constructor(
        public readonly namespace:     string                                       = 'App',
        public readonly dir:           string                                       = process.cwd(),
        public readonly version:       string                                       = ApplicationInfo.VERSION,
        public readonly environment:   string                                       = 'production',
        public readonly debugMode:     boolean                                      = false,
        public readonly timezone:      string                                       = 'UTC',
        public readonly key:           string                                       = 'some_secret_app_key',
        public readonly dataPath:      string                                       = 'App/Provider/Data',
        public readonly dataNamespace: string                                       = 'App/Provider/Data',
        public readonly providers:     ComponentProviderConstructor[]               = [ApplicationComponentProvider],
        public readonly callbacks:     ((app: ApplicationContract) => void)[]      = [],
    ) {}
}
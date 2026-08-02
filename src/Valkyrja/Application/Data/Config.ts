/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ApplicationInfo } from '../Constant/ApplicationInfo.ts';
import { ApplicationComponentProvider } from '../Provider/ApplicationComponentProvider.ts';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.ts';
import type { ConfigContract } from './Contract/ConfigContract.ts';

export class Config implements ConfigContract {
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
        public readonly providers: ComponentProviderContract[] = [new ApplicationComponentProvider()],
        public readonly callbacks: ((app: ApplicationContract) => void)[] = [],
    ) {}
}

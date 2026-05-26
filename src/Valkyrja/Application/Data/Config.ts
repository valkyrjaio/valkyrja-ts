/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationInfo } from '../Constant/ApplicationInfo.js';
import { ApplicationComponentProvider } from '../Provider/ApplicationComponentProvider.js';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.js';
import type { ConfigContract } from './Contract/ConfigContract.js';

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

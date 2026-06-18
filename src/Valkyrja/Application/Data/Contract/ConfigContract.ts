/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../../Provider/Contract/ComponentProviderContract.ts';

export interface ConfigContract {
    readonly namespace: string;
    readonly dir: string;
    readonly version: string;
    readonly environment: string;
    readonly debugMode: boolean;
    readonly timezone: string;
    readonly key: string;
    readonly dataPath: string;
    readonly dataNamespace: string;
    readonly providers: ComponentProviderContract[];
    readonly callbacks: ((app: ApplicationContract) => void)[];
}

export namespace ConfigContract {
    export function instanceOf(value: unknown): value is ConfigContract {
        return typeof value === 'object' && value !== null && 'namespace' in value;
    }
}

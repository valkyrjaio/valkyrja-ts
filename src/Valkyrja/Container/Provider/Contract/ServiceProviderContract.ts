/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ContainerContract } from '../../Manager/Contract/ContainerContract.ts';

export interface ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void>;
}

export namespace ServiceProviderContract {
    export function instanceOf(value: unknown): value is ServiceProviderContract {
        return typeof value === 'object' && value !== null && 'publishers' in value;
    }
}

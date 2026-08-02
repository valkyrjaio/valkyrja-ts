/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ListenerContract } from '../../Data/Contract/ListenerContract.ts';

export interface ListenerProviderContract {
    getListeners(): ListenerContract[];
}

export namespace ListenerProviderContract {
    export function instanceOf(value: unknown): value is ListenerProviderContract {
        return typeof value === 'object' && value !== null && 'getListeners' in value;
    }
}

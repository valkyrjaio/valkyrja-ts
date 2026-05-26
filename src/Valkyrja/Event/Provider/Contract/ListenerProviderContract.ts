/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ListenerContract } from '../../Data/Contract/ListenerContract.js';

export interface ListenerProviderContract {
    getListeners(): ListenerContract[];
}

export namespace ListenerProviderContract {
    export function instanceOf(value: unknown): value is ListenerProviderContract {
        return typeof value === 'object' && value !== null && 'getListeners' in value;
    }
}

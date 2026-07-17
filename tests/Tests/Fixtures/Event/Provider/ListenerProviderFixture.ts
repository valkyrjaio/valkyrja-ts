/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ListenerProviderContract } from '../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { ListenerContract } from '../../../../../src/Valkyrja/Event/Data/Contract/ListenerContract.ts';

export class ListenerProviderFixture implements ListenerProviderContract {
    getListeners(): ListenerContract[] {
        return [];
    }
}

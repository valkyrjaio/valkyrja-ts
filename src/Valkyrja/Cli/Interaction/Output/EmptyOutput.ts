/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MessageContract } from '../Message/Contract/MessageContract.js';
import type { EmptyOutputContract } from './Contract/EmptyOutputContract.js';
import { Output } from './Output.js';

export class EmptyOutput extends Output implements EmptyOutputContract {
    protected override outputMessage(_message: MessageContract): void {
        // empty on purpose
    }
}

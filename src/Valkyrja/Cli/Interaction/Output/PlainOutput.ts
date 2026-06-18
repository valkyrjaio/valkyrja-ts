/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MessageContract } from '../Message/Contract/MessageContract.ts';
import type { PlainOutputContract } from './Contract/PlainOutputContract.ts';
import { Output } from './Output.ts';

export class PlainOutput extends Output implements PlainOutputContract {
    protected override outputMessage(message: MessageContract): void {
        process.stdout.write(message.getText().replace(/<[^>]*>/g, ''));
    }
}

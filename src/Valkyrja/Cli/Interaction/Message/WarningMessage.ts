/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { WarningFormatter } from '../Formatter/WarningFormatter.ts';
import { Message } from './Message.ts';

export class WarningMessage extends Message {
    constructor(text: string) {
        super(text, new WarningFormatter());
    }
}

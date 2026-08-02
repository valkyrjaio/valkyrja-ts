/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ErrorFormatter } from '../Formatter/ErrorFormatter.ts';
import { Message } from './Message.ts';

export class ErrorMessage extends Message {
    constructor(text: string) {
        super(text, new ErrorFormatter());
    }
}

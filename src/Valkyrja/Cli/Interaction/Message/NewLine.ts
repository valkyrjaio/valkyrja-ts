/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FormatterContract } from '../Formatter/Contract/FormatterContract.js';
import { Message } from './Message.js';

export class NewLine extends Message {
    constructor(formatter: FormatterContract | null = null) {
        super('\n', formatter);
    }
}

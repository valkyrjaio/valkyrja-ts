/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ValueContract } from './Value/Contract/ValueContract.ts';
import { Header } from './Header.ts';
import { HeaderName } from '../Constant/HeaderName.ts';

export class Referer extends Header {
    constructor(...values: Array<ValueContract | string>) {
        super(HeaderName.REFERER, ...values);
    }
}

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Rule } from '../Abstract/Rule.ts';

export class Email extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.subject);
    }
}

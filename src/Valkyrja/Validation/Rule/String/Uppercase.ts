/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Rule } from '../Abstract/Rule.ts';

export class Uppercase extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string' && this.subject === this.subject.toUpperCase();
    }
}

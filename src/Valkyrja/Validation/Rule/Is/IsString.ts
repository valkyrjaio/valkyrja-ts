/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Rule } from '../Abstract/Rule.js';

export class IsString extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string';
    }
}

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Rule } from '../Abstract/Rule.ts';

export class NotEmpty extends Rule {
    isValid(): boolean {
        return this.subject !== '' && this.subject !== null && this.subject !== undefined;
    }
}

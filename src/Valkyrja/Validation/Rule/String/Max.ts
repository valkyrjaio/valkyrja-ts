/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Rule } from '../Abstract/Rule.js';

export class Max extends Rule {
    constructor(
        subject: unknown,
        protected readonly max: number,
        errorMessage: string,
    ) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return typeof this.subject === 'string' && this.subject.length <= this.max;
    }
}

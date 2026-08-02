/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Rule } from '../Abstract/Rule.ts';

export class Lowercase extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string' && this.subject === this.subject.toLowerCase();
    }
}

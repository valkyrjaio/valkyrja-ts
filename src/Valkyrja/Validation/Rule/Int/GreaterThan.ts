/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Rule } from '../Abstract/Rule.ts';

export class GreaterThan extends Rule {
    constructor(
        subject: unknown,
        protected readonly min: number,
        errorMessage: string,
    ) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return typeof this.subject === 'number' && this.subject > this.min;
    }
}

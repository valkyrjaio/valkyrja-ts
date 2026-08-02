/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { FormatterContract } from '../Formatter/Contract/FormatterContract.ts';
import type { ProgressContract } from './Contract/ProgressContract.ts';
import { Message } from './Message.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export class Progress extends Message implements ProgressContract {
    constructor(
        text: string,
        protected complete: boolean = false,
        protected percentage: number = 0,
        formatter: FormatterContract | null = null,
    ) {
        super(text, formatter);
    }

    isComplete(): boolean {
        return this.complete;
    }

    withIsComplete(isComplete: boolean): this {
        const clone = ObjectFactory.clone(this);
        clone.complete = isComplete;
        return clone;
    }

    getPercentage(): number {
        return this.percentage;
    }

    withPercentage(percentage: number): this {
        const clone = ObjectFactory.clone(this);
        clone.percentage = percentage;
        return clone;
    }
}

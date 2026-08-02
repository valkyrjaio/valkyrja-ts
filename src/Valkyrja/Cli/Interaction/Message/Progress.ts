/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

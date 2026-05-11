import type { FormatterContract } from '../Formatter/Contract/FormatterContract.js';
import type { ProgressContract } from './Contract/ProgressContract.js';
import { Message } from './Message.js';

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
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.complete   = isComplete;
        return clone;
    }

    getPercentage(): number {
        return this.percentage;
    }

    withPercentage(percentage: number): this {
        const clone       = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.percentage  = percentage;
        return clone;
    }
}

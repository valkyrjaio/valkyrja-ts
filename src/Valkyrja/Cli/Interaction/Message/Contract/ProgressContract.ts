import type { MessageContract } from './MessageContract.js';

export interface ProgressContract extends MessageContract {
    isComplete(): boolean;
    withIsComplete(isComplete: boolean): this;
    getPercentage(): number;
    withPercentage(percentage: number): this;
}

export namespace ProgressContract {
    export function instanceOf(value: unknown): value is ProgressContract {
        return typeof value === 'object' && value !== null && 'isComplete' in value;
    }
}

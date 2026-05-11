import type { MessageContract } from './MessageContract.js';

export interface ProgressContract extends MessageContract {
    isComplete(): boolean;
    withIsComplete(isComplete: boolean): this;
    getPercentage(): number;
    withPercentage(percentage: number): this;
}

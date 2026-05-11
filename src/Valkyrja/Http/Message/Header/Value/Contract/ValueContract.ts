import type { ComponentContract } from '../Component/Contract/ComponentContract.js';

export interface ValueContract {
    getComponents(): Array<ComponentContract | string>;
    withComponents(...components: Array<ComponentContract | string>): this;
    withAddedComponents(...components: Array<ComponentContract | string>): this;
    toString(): string;
}

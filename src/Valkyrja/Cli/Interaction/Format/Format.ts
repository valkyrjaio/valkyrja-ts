import type { FormatContract } from './Contract/FormatContract.js';

export class Format implements FormatContract {
    constructor(
        protected setCode: string,
        protected unsetCode: string,
    ) {}

    getSetCode(): string {
        return this.setCode;
    }

    withSetCode(setCode: string): this {
        const clone    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.setCode  = setCode;
        return clone;
    }

    getUnsetCode(): string {
        return this.unsetCode;
    }

    withUnsetCode(unsetCode: string): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.unsetCode  = unsetCode;
        return clone;
    }
}
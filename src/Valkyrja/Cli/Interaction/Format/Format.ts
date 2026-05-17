import type { FormatContract } from './Contract/FormatContract.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

export class Format implements FormatContract {
    constructor(
        protected setCode: string,
        protected unsetCode: string,
    ) {}

    getSetCode(): string {
        return this.setCode;
    }

    withSetCode(setCode: string): this {
        const clone    = ObjectFactory.clone(this);
        clone.setCode  = setCode;
        return clone;
    }

    getUnsetCode(): string {
        return this.unsetCode;
    }

    withUnsetCode(unsetCode: string): this {
        const clone      = ObjectFactory.clone(this);
        clone.unsetCode  = unsetCode;
        return clone;
    }
}

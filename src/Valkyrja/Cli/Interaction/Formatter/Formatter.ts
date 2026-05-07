import type { FormatContract } from '../Format/Contract/FormatContract.js';
import type { FormatterContract } from './Contract/FormatterContract.js';

export class Formatter implements FormatterContract {
    protected formats: FormatContract[];

    constructor(...formats: FormatContract[]) {
        this.formats = formats;
    }

    getFormats(): FormatContract[] {
        return this.formats;
    }

    withFormats(...formats: FormatContract[]): this {
        const clone    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.formats  = formats;
        return clone;
    }

    formatText(text: string): string {
        if (this.formats.length === 0) {
            return text;
        }

        const set: string[]   = [];
        const unset: string[] = [];

        for (const format of this.formats) {
            set.push(format.getSetCode());
            unset.push(format.getUnsetCode());
        }

        return `\x1b[${set.join(';')}m${text}\x1b[${unset.join(';')}m`;
    }
}
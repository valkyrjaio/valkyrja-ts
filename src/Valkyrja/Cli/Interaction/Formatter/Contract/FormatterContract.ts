import type { FormatContract } from '../../Format/Contract/FormatContract.js';

export interface FormatterContract {
    getFormats(): FormatContract[];
    withFormats(...formats: FormatContract[]): this;
    formatText(text: string): string;
}

export namespace FormatterContract {
    export function instanceOf(value: unknown): value is FormatterContract {
        return typeof value === 'object' && value !== null && 'formatText' in value;
    }
}

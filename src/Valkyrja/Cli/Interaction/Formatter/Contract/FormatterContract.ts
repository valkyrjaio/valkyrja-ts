import type { FormatContract } from '../../Format/Contract/FormatContract.js';

export interface FormatterContract {
    getFormats(): FormatContract[];
    withFormats(...formats: FormatContract[]): this;
    formatText(text: string): string;
}

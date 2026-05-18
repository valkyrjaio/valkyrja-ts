export interface CliNoInteractionConfigContract {
    readonly noInteractionOptionName: string;
    readonly noInteractionOptionShortName: string;
}

export namespace CliNoInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliNoInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'noInteractionOptionName' in value;
    }
}

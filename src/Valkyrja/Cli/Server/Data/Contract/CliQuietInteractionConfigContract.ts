export interface CliQuietInteractionConfigContract {
    readonly quietOptionName:      string;
    readonly quietOptionShortName: string;
}

export namespace CliQuietInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliQuietInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'quietOptionName' in value;
    }
}

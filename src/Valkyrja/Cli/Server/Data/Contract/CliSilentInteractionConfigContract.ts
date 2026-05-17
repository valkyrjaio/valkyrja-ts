export interface CliSilentInteractionConfigContract {
    readonly silentOptionName: string;
    readonly silentOptionShortName: string;
}

export namespace CliSilentInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliSilentInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'silentOptionName' in value;
    }
}

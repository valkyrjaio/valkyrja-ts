export interface CliInteractionConfigContract {
    isQuiet: boolean;
    isInteractive: boolean;
    isSilent: boolean;
}

export namespace CliInteractionConfigContract {
    export function instanceOf(value: unknown): value is CliInteractionConfigContract {
        return typeof value === 'object' && value !== null && 'isQuiet' in value;
    }
}

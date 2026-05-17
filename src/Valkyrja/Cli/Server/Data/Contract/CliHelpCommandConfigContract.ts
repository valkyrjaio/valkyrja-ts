export interface CliHelpCommandConfigContract {
    readonly helpCommandName: string;
    readonly helpOptionName: string;
    readonly helpOptionShortName: string;
}

export namespace CliHelpCommandConfigContract {
    export function instanceOf(value: unknown): value is CliHelpCommandConfigContract {
        return typeof value === 'object' && value !== null && 'helpCommandName' in value;
    }
}

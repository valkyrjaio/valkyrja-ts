export interface CliVersionCommandConfigContract {
    readonly versionCommandName: string;
    readonly versionOptionName: string;
    readonly versionOptionShortName: string;
}

export namespace CliVersionCommandConfigContract {
    export function instanceOf(value: unknown): value is CliVersionCommandConfigContract {
        return typeof value === 'object' && value !== null && 'versionCommandName' in value;
    }
}

export interface CliRoutingConfigContract {
    readonly dataClassName: string;
}

export namespace CliRoutingConfigContract {
    export function instanceOf(value: unknown): value is CliRoutingConfigContract {
        return typeof value === 'object' && value !== null && 'dataClassName' in value;
    }
}

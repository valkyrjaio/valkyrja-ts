export interface ThrowableHandlerContract {
    enable(options?: { displayErrors?: boolean }): void;
}

export namespace ThrowableHandlerContract {
    export function instanceOf(value: unknown): value is ThrowableHandlerContract {
        return typeof value === 'object' && value !== null && 'enable' in value;
    }
}

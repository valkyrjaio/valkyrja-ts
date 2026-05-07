export interface ThrowableHandlerContract {
    enable(options?: { displayErrors?: boolean }): void;
}

export interface ThrowableHandlerConstructor {
    new(): ThrowableHandlerContract;
    getTraceCode(error: Error): string;
    enable(options?: { displayErrors?: boolean }): void;
}

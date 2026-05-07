export interface ValkyrjaThrowable extends Error {
    getTraceCode(): string;
}

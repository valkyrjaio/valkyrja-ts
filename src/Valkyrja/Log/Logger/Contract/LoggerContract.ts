export const LoggerContractId = 'Valkyrja.Log.Logger.LoggerContract' as const;

export interface LoggerContract {
    throwable(throwable: Error, message: string): void;
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    notice(message: string, context?: Record<string, unknown>): void;
    warning(message: string, context?: Record<string, unknown>): void;
    error(message: string, context?: Record<string, unknown>): void;
    critical(message: string, context?: Record<string, unknown>): void;
    alert(message: string, context?: Record<string, unknown>): void;
    emergency(message: string, context?: Record<string, unknown>): void;
}

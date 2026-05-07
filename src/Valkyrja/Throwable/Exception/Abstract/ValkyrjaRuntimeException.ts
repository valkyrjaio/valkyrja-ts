import { ThrowableHandler } from '../../Handler/Abstract/ThrowableHandler.js';

import { type ValkyrjaThrowable } from '../../Contract/ValkyrjaThrowable.js';

export abstract class ValkyrjaRuntimeException extends Error implements ValkyrjaThrowable {
    getTraceCode(): string {
        return ThrowableHandler.getTraceCode(this);
    }
}
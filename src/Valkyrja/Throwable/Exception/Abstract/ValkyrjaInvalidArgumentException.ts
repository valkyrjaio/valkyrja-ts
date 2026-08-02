/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ThrowableHandler } from '../../Handler/Abstract/ThrowableHandler.ts';

import { type ValkyrjaThrowable } from '../../Contract/ValkyrjaThrowable.ts';

export abstract class ValkyrjaInvalidArgumentException extends Error implements ValkyrjaThrowable {
    getTraceCode(): string {
        return ThrowableHandler.getTraceCode(this);
    }
}

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { createHash } from 'node:crypto';

import { type ThrowableHandlerContract } from '../Contract/ThrowableHandlerContract.ts';

export abstract class ThrowableHandler implements ThrowableHandlerContract {
    static getTraceCode(error: Error): string {
        return createHash('md5')
            .update(error.constructor.name + (error.stack ?? ''))
            .digest('hex');
    }

    abstract enable(options?: { displayErrors?: boolean }): void;
}

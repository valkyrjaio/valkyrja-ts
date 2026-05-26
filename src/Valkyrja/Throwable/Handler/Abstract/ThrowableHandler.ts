/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createHash } from 'node:crypto';

import { type ThrowableHandlerContract } from '../Contract/ThrowableHandlerContract.js';

export abstract class ThrowableHandler implements ThrowableHandlerContract {
    static getTraceCode(error: Error): string {
        return createHash('md5')
            .update(error.constructor.name + (error.stack ?? ''))
            .digest('hex');
    }

    abstract enable(options?: { displayErrors?: boolean }): void;
}

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ThrowableHandler } from '../../Handler/Abstract/ThrowableHandler.ts';

import { type ValkyrjaThrowable } from '../../Contract/ValkyrjaThrowable.ts';

export abstract class ValkyrjaInvalidArgumentException extends Error implements ValkyrjaThrowable {
    getTraceCode(): string {
        return ThrowableHandler.getTraceCode(this);
    }
}

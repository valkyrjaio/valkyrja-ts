/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface ThrowableHandlerContract {
    enable(options?: { displayErrors?: boolean }): void;
}

export namespace ThrowableHandlerContract {
    export function instanceOf(value: unknown): value is ThrowableHandlerContract {
        return typeof value === 'object' && value !== null && 'enable' in value;
    }
}

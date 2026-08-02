/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { OutputContract } from './OutputContract.ts';

export interface StreamOutputContract extends OutputContract {
    getStream(): NodeJS.WritableStream;
    withStream(stream: NodeJS.WritableStream): this;
}

export namespace StreamOutputContract {
    export function instanceOf(value: unknown): value is StreamOutputContract {
        return typeof value === 'object' && value !== null && 'getStream' in value;
    }
}

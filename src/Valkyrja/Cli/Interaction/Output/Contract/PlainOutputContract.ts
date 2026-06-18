/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { OutputContract } from './OutputContract.ts';

export type PlainOutputContract = OutputContract;

export namespace PlainOutputContract {
    export function instanceOf(value: unknown): value is PlainOutputContract {
        return typeof value === 'object' && value !== null && 'getMessages' in value;
    }
}

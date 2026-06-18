/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { OutputContract } from './OutputContract.ts';

export interface FileOutputContract extends OutputContract {
    getFilepath(): string;
    withFilepath(filepath: string): this;
}

export namespace FileOutputContract {
    export function instanceOf(value: unknown): value is FileOutputContract {
        return typeof value === 'object' && value !== null && 'getFilepath' in value;
    }
}

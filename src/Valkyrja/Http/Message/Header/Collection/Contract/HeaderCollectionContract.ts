/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeaderContract } from '../../Contract/HeaderContract.ts';

export interface HeaderCollectionContract {
    has(name: string): boolean;
    get(name: string): HeaderContract;
    getHeaderLine(name: string): string;
    getAll(): Record<string, HeaderContract>;
    getOnly(...names: string[]): Record<string, HeaderContract>;
    getAllExcept(...names: string[]): Record<string, HeaderContract>;
    withHeader(header: HeaderContract): this;
    withoutHeader(name: string): this;
    withHeaders(...headers: HeaderContract[]): this;
    withAddedHeaders(...headers: HeaderContract[]): this;
}

/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface ParamCollectionContract<V = unknown> {
    has(key: string): boolean;
    get(key: string): V | undefined;
    getAll(): Record<string, V>;
    getOnly(...keys: string[]): Record<string, V>;
    getAllExcept(...keys: string[]): Record<string, V>;
    with(params: Record<string, V>): this;
    withAdded(params: Record<string, V>): this;
}

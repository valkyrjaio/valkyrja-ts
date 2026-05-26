/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class ObjectFactory {
    static clone<T extends object>(object: T): T {
        return Object.assign(Object.create(Object.getPrototypeOf(object) as object | null) as T, object);
    }
}

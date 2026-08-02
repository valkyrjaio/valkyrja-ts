/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class ObjectFactory {
    static clone<T extends object>(object: T): T {
        return Object.assign(Object.create(Object.getPrototypeOf(object) as object | null) as T, object);
    }
}

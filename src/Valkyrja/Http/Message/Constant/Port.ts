/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class Port {
    static readonly MIN = 1 as const;
    static readonly MAX = 65535 as const;
    static readonly HTTP = 80 as const;
    static readonly HTTPS = 443 as const;

    static isValid(port: number): boolean {
        return port >= Port.MIN && port <= Port.MAX;
    }
}

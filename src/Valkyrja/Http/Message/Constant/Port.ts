/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

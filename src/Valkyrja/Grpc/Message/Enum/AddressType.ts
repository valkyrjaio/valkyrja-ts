/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/** The transport address family of a connection's peer. */
export enum AddressType {
    IPV4 = 'IPV4',
    IPV6 = 'IPV6',
    UNIX = 'UNIX',
    UNKNOWN = 'UNKNOWN',
}

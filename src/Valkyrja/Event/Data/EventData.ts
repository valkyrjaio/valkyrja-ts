/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class EventData {
    constructor(
        public readonly events: Record<string, string[]> = {},
        public readonly listeners: Record<string, () => object> = {},
    ) {}
}

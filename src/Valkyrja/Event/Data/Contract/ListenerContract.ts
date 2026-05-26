/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';

export interface ListenerContract {
    getEventId(): string;
    withEventId(eventId: string): ListenerContract;
    getName(): string;
    withName(name: string): ListenerContract;
    getHandler(): (container: ContainerContract, args?: unknown[]) => unknown;
    withHandler(handler: (container: ContainerContract, args?: unknown[]) => unknown): ListenerContract;
}

export namespace ListenerContract {
    export function instanceOf(value: unknown): value is ListenerContract {
        return typeof value === 'object' && value !== null && 'getEventId' in value;
    }
}

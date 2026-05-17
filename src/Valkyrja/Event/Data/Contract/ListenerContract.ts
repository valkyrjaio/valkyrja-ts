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

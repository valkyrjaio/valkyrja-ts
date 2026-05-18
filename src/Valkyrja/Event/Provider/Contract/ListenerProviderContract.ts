import type { ListenerContract } from '../../Data/Contract/ListenerContract.js';

export interface ListenerProviderContract {
    getListeners(): ListenerContract[];
}

export namespace ListenerProviderContract {
    export function instanceOf(value: unknown): value is ListenerProviderContract {
        return typeof value === 'object' && value !== null && 'getListeners' in value;
    }
}

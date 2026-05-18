import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface RouterContract {
    dispatch(input: InputContract): OutputContract;
    dispatchRoute(input: InputContract, route: RouteContract): OutputContract;
}

export namespace RouterContract {
    export function instanceOf(value: unknown): value is RouterContract {
        return typeof value === 'object' && value !== null && 'dispatch' in value;
    }
}

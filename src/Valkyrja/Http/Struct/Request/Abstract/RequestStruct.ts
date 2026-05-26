/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { RequestStructContract } from '../Contract/RequestStructContract.js';

export abstract class RequestStruct implements RequestStructContract {
    abstract readonly name: string;
    abstract readonly value: unknown;

    constructor(protected readonly fields: string[]) {}

    getDataFromRequest(request: ServerRequestContract): Record<string, unknown> {
        return this.getOnlyParamsFromRequest(request, ...this.fields);
    }

    determineIfRequestContainsExtraData(request: ServerRequestContract): boolean {
        return Object.keys(this.getExceptParamsFromRequest(request, ...this.fields)).length > 0;
    }

    protected abstract getOnlyParamsFromRequest(
        request: ServerRequestContract,
        ...keys: string[]
    ): Record<string, unknown>;

    protected abstract getExceptParamsFromRequest(
        request: ServerRequestContract,
        ...keys: string[]
    ): Record<string, unknown>;
}

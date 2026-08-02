/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RequestStruct } from '../../../../../../../src/Valkyrja/Http/Struct/Request/Abstract/RequestStruct.ts';

import type { ServerRequestContract } from '../../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';

class TestStruct extends RequestStruct {
    readonly name = 'test';
    readonly value = null;

    protected getOnlyParamsFromRequest(): Record<string, unknown> {
        return { a: 1 };
    }

    protected getExceptParamsFromRequest(): Record<string, unknown> {
        return { b: 2 };
    }
}

class EmptyExtraStruct extends TestStruct {
    protected override getExceptParamsFromRequest(): Record<string, unknown> {
        return {};
    }
}

const request = {} as ServerRequestContract;

describe('RequestStruct', () => {
    it('returns only the configured fields from the request', () => {
        expect(new TestStruct(['a']).getDataFromRequest(request)).toStrictEqual({ a: 1 });
    });

    it('detects whether the request carries extra data', () => {
        expect(new TestStruct(['a']).determineIfRequestContainsExtraData(request)).toBe(true);
        expect(new EmptyExtraStruct(['a']).determineIfRequestContainsExtraData(request)).toBe(false);
    });
});

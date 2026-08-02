/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HttpConfigContract } from '../../../../../../src/Valkyrja/Application/Data/Contract/HttpConfigContract.ts';

describe('HttpConfigContract', () => {
    it('instanceOf is true for an object exposing requestReceivedMiddleware', () => {
        expect(HttpConfigContract.instanceOf({ requestReceivedMiddleware: [] })).toBe(true);
    });

    it('instanceOf is false for non-configs', () => {
        expect(HttpConfigContract.instanceOf(null)).toBe(false);
        expect(HttpConfigContract.instanceOf({})).toBe(false);
    });
});

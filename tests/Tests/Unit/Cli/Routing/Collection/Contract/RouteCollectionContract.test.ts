/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteCollectionContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Collection/Contract/RouteCollectionContract.ts';

describe('RouteCollectionContract', () => {
    it('instanceOf is true for an object exposing getData', () => {
        expect(RouteCollectionContract.instanceOf({ getData: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteCollectionContract.instanceOf(null)).toBe(false);
        expect(RouteCollectionContract.instanceOf({})).toBe(false);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ListenerCollection } from '../../../../../../src/Valkyrja/Event/Collection/ListenerCollection.ts';
import { ListenerCollectionContract } from '../../../../../../src/Valkyrja/Event/Collection/Contract/ListenerCollectionContract.ts';

describe('ListenerCollectionContract', () => {
    it('instanceOf is true for a collection', () => {
        expect(ListenerCollectionContract.instanceOf(new ListenerCollection())).toBe(true);
    });

    it('instanceOf is false for non-collections', () => {
        expect(ListenerCollectionContract.instanceOf(null)).toBe(false);
        expect(ListenerCollectionContract.instanceOf({})).toBe(false);
        expect(ListenerCollectionContract.instanceOf('collection')).toBe(false);
    });
});

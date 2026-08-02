/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ContainerData } from '../../../../../src/Valkyrja/Container/Data/ContainerData.ts';

describe('ContainerData', () => {
    it('has empty defaults', () => {
        const data = new ContainerData();

        expect(data.aliases).toStrictEqual({});
        expect(data.deferredCallback).toStrictEqual({});
        expect(data.services).toStrictEqual({});
        expect(data.singletons).toStrictEqual({});
    });
});

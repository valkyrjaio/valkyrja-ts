/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { EventData } from '../../../../../src/Valkyrja/Event/Data/EventData.ts';

describe('EventData', () => {
    it('has empty defaults', () => {
        const data = new EventData();

        expect(data.events).toStrictEqual({});
        expect(data.listeners).toStrictEqual({});
    });
});

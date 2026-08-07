/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { EventDispatcher } from '../../../../../../src/Valkyrja/Event/Dispatcher/EventDispatcher.ts';
import { EventDispatcherContract } from '../../../../../../src/Valkyrja/Event/Dispatcher/Contract/EventDispatcherContract.ts';

describe('EventDispatcherContract', () => {
    it('instanceOf is true for a dispatcher', () => {
        expect(EventDispatcherContract.instanceOf(new EventDispatcher())).toBe(true);
    });

    it('instanceOf is false for non-dispatchers', () => {
        expect(EventDispatcherContract.instanceOf(null)).toBe(false);
        expect(EventDispatcherContract.instanceOf({})).toBe(false);
        expect(EventDispatcherContract.instanceOf('dispatcher')).toBe(false);
    });
});

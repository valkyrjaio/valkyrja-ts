/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HostPortAccumulator } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Data/HostPortAccumulator.ts';

describe('HostPortAccumulator', () => {
    it('defaults to an empty host and zero port', () => {
        const accumulator = new HostPortAccumulator();

        expect(accumulator.host).toBe('');
        expect(accumulator.port).toBe(0);
    });

    it('stores the given host and port', () => {
        const accumulator = new HostPortAccumulator('example.com', 8080);

        expect(accumulator.host).toBe('example.com');
        expect(accumulator.port).toBe(8080);
    });
});

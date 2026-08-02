/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { FormatContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Format/Contract/FormatContract.ts';
import { Format } from '../../../../../../src/Valkyrja/Cli/Interaction/Format/Format.ts';

describe('Format', () => {
    it('exposes the set and unset codes given to the constructor', () => {
        const format = new Format('1', '22');

        expect(format.getSetCode()).toBe('1');
        expect(format.getUnsetCode()).toBe('22');
    });

    it('withSetCode returns an immutable clone with the new set code', () => {
        const format = new Format('1', '22');
        const next = format.withSetCode('4');

        expect(next).not.toBe(format);
        expect(format.getSetCode()).toBe('1');
        expect(next.getSetCode()).toBe('4');
        expect(next.getUnsetCode()).toBe('22');
    });

    it('withUnsetCode returns an immutable clone with the new unset code', () => {
        const format = new Format('1', '22');
        const next = format.withUnsetCode('24');

        expect(next).not.toBe(format);
        expect(format.getUnsetCode()).toBe('22');
        expect(next.getUnsetCode()).toBe('24');
        expect(next.getSetCode()).toBe('1');
    });

    it('instanceOf is true for a Format and false otherwise', () => {
        expect(FormatContract.instanceOf(new Format('1', '22'))).toBe(true);
        expect(FormatContract.instanceOf(null)).toBe(false);
        expect(FormatContract.instanceOf({})).toBe(false);
    });
});

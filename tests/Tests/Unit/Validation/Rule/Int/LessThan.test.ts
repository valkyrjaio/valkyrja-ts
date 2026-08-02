/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { LessThan } from '../../../../../../src/Valkyrja/Validation/Rule/Int/LessThan.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('LessThan', () => {
    it('is valid when the subject is less than the maximum', () => {
        expect(new LessThan(1, 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(true);
    });

    it('is invalid when the subject is equal to or greater than the maximum', () => {
        expect(new LessThan(5, 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(false);
        expect(new LessThan(10, 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(false);
    });

    it('is invalid for non-numbers', () => {
        expect(new LessThan('1', 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(false);
        expect(new LessThan(null, 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(false);
    });

    it('validate throws when not less than the maximum', () => {
        expect(() => {
            new LessThan(10, 5, ErrorMessage.INT_LESS_THAN).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

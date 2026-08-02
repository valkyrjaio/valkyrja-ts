/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { Equal } from '../../../../../../src/Valkyrja/Validation/Rule/Is/Equal.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Equal', () => {
    it('is valid when the subject strictly equals the value', () => {
        expect(new Equal('a', 'a', ErrorMessage.IS_EQUAL).isValid()).toBe(true);
        expect(new Equal(5, 5, ErrorMessage.IS_EQUAL).isValid()).toBe(true);
    });

    it('is invalid when the subject differs from the value', () => {
        expect(new Equal('a', 'b', ErrorMessage.IS_EQUAL).isValid()).toBe(false);
        expect(new Equal(5, '5', ErrorMessage.IS_EQUAL).isValid()).toBe(false);
    });

    it('validate throws when not equal', () => {
        expect(() => {
            new Equal('a', 'b', ErrorMessage.IS_EQUAL).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

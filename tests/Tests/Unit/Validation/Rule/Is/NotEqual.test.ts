/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { NotEqual } from '../../../../../../src/Valkyrja/Validation/Rule/Is/NotEqual.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('NotEqual', () => {
    it('is valid when the subject differs from the value', () => {
        expect(new NotEqual('a', 'b', ErrorMessage.IS_NOT_EQUAL).isValid()).toBe(true);
        expect(new NotEqual(5, '5', ErrorMessage.IS_NOT_EQUAL).isValid()).toBe(true);
    });

    it('is invalid when the subject strictly equals the value', () => {
        expect(new NotEqual('a', 'a', ErrorMessage.IS_NOT_EQUAL).isValid()).toBe(false);
        expect(new NotEqual(5, 5, ErrorMessage.IS_NOT_EQUAL).isValid()).toBe(false);
    });

    it('validate throws when equal', () => {
        expect(() => {
            new NotEqual('a', 'a', ErrorMessage.IS_NOT_EQUAL).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

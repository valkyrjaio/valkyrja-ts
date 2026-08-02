/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { IsEmpty } from '../../../../../../src/Valkyrja/Validation/Rule/Is/IsEmpty.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('IsEmpty', () => {
    it('is valid for empty string, null and undefined', () => {
        expect(new IsEmpty('', ErrorMessage.IS_EMPTY).isValid()).toBe(true);
        expect(new IsEmpty(null, ErrorMessage.IS_EMPTY).isValid()).toBe(true);
        expect(new IsEmpty(undefined, ErrorMessage.IS_EMPTY).isValid()).toBe(true);
    });

    it('is invalid for non-empty values', () => {
        expect(new IsEmpty('hello', ErrorMessage.IS_EMPTY).isValid()).toBe(false);
        expect(new IsEmpty(0, ErrorMessage.IS_EMPTY).isValid()).toBe(false);
        expect(new IsEmpty(false, ErrorMessage.IS_EMPTY).isValid()).toBe(false);
    });

    it('validate throws for a non-empty value', () => {
        expect(() => {
            new IsEmpty('x', ErrorMessage.IS_EMPTY).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

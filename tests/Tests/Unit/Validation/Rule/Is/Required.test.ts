/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { Required } from '../../../../../../src/Valkyrja/Validation/Rule/Is/Required.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Required', () => {
    it('exposes the subject', () => {
        const rule = new Required('test', ErrorMessage.REQUIRED);

        expect(rule.getSubject()).toBe('test');
    });

    it('is valid for truthy values', () => {
        expect(new Required('hello', ErrorMessage.REQUIRED).isValid()).toBe(true);
        expect(new Required(42, ErrorMessage.REQUIRED).isValid()).toBe(true);
        expect(new Required(true, ErrorMessage.REQUIRED).isValid()).toBe(true);
        expect(new Required(['item'], ErrorMessage.REQUIRED).isValid()).toBe(true);
    });

    it('is invalid for falsy values', () => {
        expect(new Required('', ErrorMessage.REQUIRED).isValid()).toBe(false);
        expect(new Required(null, ErrorMessage.REQUIRED).isValid()).toBe(false);
        expect(new Required(false, ErrorMessage.REQUIRED).isValid()).toBe(false);
        expect(new Required(0, ErrorMessage.REQUIRED).isValid()).toBe(false);
    });

    it('validate does not throw for a truthy value', () => {
        expect(() => {
            new Required('value', ErrorMessage.REQUIRED).validate();
        }).not.toThrow();
    });

    it('validate throws for a falsy value', () => {
        expect(() => {
            new Required('', ErrorMessage.REQUIRED).validate();
        }).toThrow(ValidationRuleFailureException);
        expect(() => {
            new Required('', ErrorMessage.REQUIRED).validate();
        }).toThrow(ErrorMessage.REQUIRED);
    });

    it('uses a custom error message', () => {
        expect(() => {
            new Required('', 'Field is required').validate();
        }).toThrow('Field is required');
    });
});

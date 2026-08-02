/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { Uppercase } from '../../../../../../src/Valkyrja/Validation/Rule/String/Uppercase.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Uppercase', () => {
    it('is valid for uppercase strings', () => {
        expect(new Uppercase('HELLO', ErrorMessage.STRING_UPPERCASE).isValid()).toBe(true);
        expect(new Uppercase('HELLO123', ErrorMessage.STRING_UPPERCASE).isValid()).toBe(true);
    });

    it('is invalid for strings containing lowercase characters', () => {
        expect(new Uppercase('Hello', ErrorMessage.STRING_UPPERCASE).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new Uppercase(123, ErrorMessage.STRING_UPPERCASE).isValid()).toBe(false);
    });

    it('validate throws for a lowercase value', () => {
        expect(() => {
            new Uppercase('hello', ErrorMessage.STRING_UPPERCASE).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

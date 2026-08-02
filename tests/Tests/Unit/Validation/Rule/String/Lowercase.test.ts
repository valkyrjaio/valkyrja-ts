/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { Lowercase } from '../../../../../../src/Valkyrja/Validation/Rule/String/Lowercase.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Lowercase', () => {
    it('is valid for lowercase strings', () => {
        expect(new Lowercase('hello', ErrorMessage.STRING_LOWERCASE).isValid()).toBe(true);
        expect(new Lowercase('hello123', ErrorMessage.STRING_LOWERCASE).isValid()).toBe(true);
    });

    it('is invalid for strings containing uppercase characters', () => {
        expect(new Lowercase('Hello', ErrorMessage.STRING_LOWERCASE).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new Lowercase(123, ErrorMessage.STRING_LOWERCASE).isValid()).toBe(false);
    });

    it('validate throws for an uppercase value', () => {
        expect(() => {
            new Lowercase('HELLO', ErrorMessage.STRING_LOWERCASE).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

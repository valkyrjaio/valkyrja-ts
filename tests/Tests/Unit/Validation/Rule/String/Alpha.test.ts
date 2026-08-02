/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { Alpha } from '../../../../../../src/Valkyrja/Validation/Rule/String/Alpha.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Alpha', () => {
    it('is valid for purely alphabetic strings', () => {
        expect(new Alpha('Hello', ErrorMessage.STRING_ALPHA).isValid()).toBe(true);
        expect(new Alpha('abcXYZ', ErrorMessage.STRING_ALPHA).isValid()).toBe(true);
    });

    it('is invalid for strings with non-alphabetic characters', () => {
        expect(new Alpha('hello1', ErrorMessage.STRING_ALPHA).isValid()).toBe(false);
        expect(new Alpha('hello world', ErrorMessage.STRING_ALPHA).isValid()).toBe(false);
        expect(new Alpha('', ErrorMessage.STRING_ALPHA).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new Alpha(123, ErrorMessage.STRING_ALPHA).isValid()).toBe(false);
    });

    it('validate throws for a non-alphabetic value', () => {
        expect(() => {
            new Alpha('1', ErrorMessage.STRING_ALPHA).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

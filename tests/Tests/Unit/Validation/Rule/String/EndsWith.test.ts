/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { EndsWith } from '../../../../../../src/Valkyrja/Validation/Rule/String/EndsWith.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('EndsWith', () => {
    it('is valid when the subject ends with the needle', () => {
        expect(new EndsWith('hello world', 'world', ErrorMessage.STRING_ENDS_WITH).isValid()).toBe(true);
    });

    it('is invalid when the subject does not end with the needle', () => {
        expect(new EndsWith('hello world', 'hello', ErrorMessage.STRING_ENDS_WITH).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new EndsWith(123, 'world', ErrorMessage.STRING_ENDS_WITH).isValid()).toBe(false);
    });

    it('validate throws when the suffix is absent', () => {
        expect(() => {
            new EndsWith('hello', 'world', ErrorMessage.STRING_ENDS_WITH).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

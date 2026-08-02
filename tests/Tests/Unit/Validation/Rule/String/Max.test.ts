/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { Max } from '../../../../../../src/Valkyrja/Validation/Rule/String/Max.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Max', () => {
    it('is valid when the length is at or below the maximum', () => {
        expect(new Max('hello', 5, ErrorMessage.STRING_MAX).isValid()).toBe(true);
        expect(new Max('hi', 5, ErrorMessage.STRING_MAX).isValid()).toBe(true);
    });

    it('is invalid when the length exceeds the maximum', () => {
        expect(new Max('hello world', 5, ErrorMessage.STRING_MAX).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new Max(123, 5, ErrorMessage.STRING_MAX).isValid()).toBe(false);
    });

    it('validate throws when too long', () => {
        expect(() => {
            new Max('too long', 5, ErrorMessage.STRING_MAX).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

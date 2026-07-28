/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { Regex } from '../../../../../../src/Valkyrja/Validation/Rule/String/Regex.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Regex', () => {
    it('is valid when the subject matches the pattern', () => {
        expect(new Regex('abc123', '^[a-z0-9]+$', ErrorMessage.STRING_REGEX).isValid()).toBe(true);
    });

    it('is invalid when the subject does not match the pattern', () => {
        expect(new Regex('ABC', '^[a-z]+$', ErrorMessage.STRING_REGEX).isValid()).toBe(false);
    });

    it('is invalid for an empty string', () => {
        expect(new Regex('', '^[a-z]*$', ErrorMessage.STRING_REGEX).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new Regex(123, '^[0-9]+$', ErrorMessage.STRING_REGEX).isValid()).toBe(false);
    });

    it('validate throws when the pattern does not match', () => {
        expect(() => {
            new Regex('ABC', '^[a-z]+$', ErrorMessage.STRING_REGEX).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

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
        expect(() => new Uppercase('hello', ErrorMessage.STRING_UPPERCASE).validate()).toThrow(
            ValidationRuleFailureException,
        );
    });
});

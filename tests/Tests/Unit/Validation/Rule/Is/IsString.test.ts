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
import { IsString } from '../../../../../../src/Valkyrja/Validation/Rule/Is/IsString.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('IsString', () => {
    it('is valid for strings', () => {
        expect(new IsString('hello', ErrorMessage.IS_STRING).isValid()).toBe(true);
        expect(new IsString('', ErrorMessage.IS_STRING).isValid()).toBe(true);
    });

    it('is invalid for non-strings', () => {
        expect(new IsString(42, ErrorMessage.IS_STRING).isValid()).toBe(false);
        expect(new IsString(null, ErrorMessage.IS_STRING).isValid()).toBe(false);
        expect(new IsString(true, ErrorMessage.IS_STRING).isValid()).toBe(false);
    });

    it('validate throws for a non-string', () => {
        expect(() => {
            new IsString(1, ErrorMessage.IS_STRING).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

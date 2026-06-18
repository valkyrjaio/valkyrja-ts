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
import { IsNumeric } from '../../../../../../src/Valkyrja/Validation/Rule/Is/IsNumeric.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('IsNumeric', () => {
    it('is valid for numbers and numeric strings', () => {
        expect(new IsNumeric(42, ErrorMessage.IS_NUMERIC).isValid()).toBe(true);
        expect(new IsNumeric('123', ErrorMessage.IS_NUMERIC).isValid()).toBe(true);
        expect(new IsNumeric('1.5', ErrorMessage.IS_NUMERIC).isValid()).toBe(true);
    });

    it('is invalid for non-numeric strings and other types', () => {
        expect(new IsNumeric('abc', ErrorMessage.IS_NUMERIC).isValid()).toBe(false);
        expect(new IsNumeric(null, ErrorMessage.IS_NUMERIC).isValid()).toBe(false);
        expect(new IsNumeric(true, ErrorMessage.IS_NUMERIC).isValid()).toBe(false);
    });

    it('validate throws for a non-numeric value', () => {
        expect(() => new IsNumeric('abc', ErrorMessage.IS_NUMERIC).validate()).toThrow(ValidationRuleFailureException);
    });
});

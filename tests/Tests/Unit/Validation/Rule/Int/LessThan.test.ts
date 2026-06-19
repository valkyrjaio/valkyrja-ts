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
import { LessThan } from '../../../../../../src/Valkyrja/Validation/Rule/Int/LessThan.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('LessThan', () => {
    it('is valid when the subject is less than the maximum', () => {
        expect(new LessThan(1, 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(true);
    });

    it('is invalid when the subject is equal to or greater than the maximum', () => {
        expect(new LessThan(5, 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(false);
        expect(new LessThan(10, 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(false);
    });

    it('is invalid for non-numbers', () => {
        expect(new LessThan('1', 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(false);
        expect(new LessThan(null, 5, ErrorMessage.INT_LESS_THAN).isValid()).toBe(false);
    });

    it('validate throws when not less than the maximum', () => {
        expect(() => new LessThan(10, 5, ErrorMessage.INT_LESS_THAN).validate()).toThrow(
            ValidationRuleFailureException,
        );
    });
});

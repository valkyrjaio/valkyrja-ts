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
import { GreaterThan } from '../../../../../../src/Valkyrja/Validation/Rule/Int/GreaterThan.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('GreaterThan', () => {
    it('is valid when the subject is greater than the minimum', () => {
        expect(new GreaterThan(10, 5, ErrorMessage.INT_GREATER_THAN).isValid()).toBe(true);
    });

    it('is invalid when the subject is equal to or less than the minimum', () => {
        expect(new GreaterThan(5, 5, ErrorMessage.INT_GREATER_THAN).isValid()).toBe(false);
        expect(new GreaterThan(1, 5, ErrorMessage.INT_GREATER_THAN).isValid()).toBe(false);
    });

    it('is invalid for non-numbers', () => {
        expect(new GreaterThan('10', 5, ErrorMessage.INT_GREATER_THAN).isValid()).toBe(false);
        expect(new GreaterThan(null, 5, ErrorMessage.INT_GREATER_THAN).isValid()).toBe(false);
    });

    it('validate throws when not greater than the minimum', () => {
        expect(() => {
            new GreaterThan(1, 5, ErrorMessage.INT_GREATER_THAN).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

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
import { Min } from '../../../../../../src/Valkyrja/Validation/Rule/String/Min.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Min', () => {
    it('is valid when the length is at or above the minimum', () => {
        expect(new Min('hello', 5, ErrorMessage.STRING_MIN).isValid()).toBe(true);
        expect(new Min('hello world', 5, ErrorMessage.STRING_MIN).isValid()).toBe(true);
    });

    it('is invalid when the length is below the minimum', () => {
        expect(new Min('hi', 5, ErrorMessage.STRING_MIN).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new Min(123, 5, ErrorMessage.STRING_MIN).isValid()).toBe(false);
    });

    it('validate throws when too short', () => {
        expect(() => new Min('hi', 5, ErrorMessage.STRING_MIN).validate()).toThrow(ValidationRuleFailureException);
    });
});

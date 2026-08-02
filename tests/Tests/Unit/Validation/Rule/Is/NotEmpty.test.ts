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
import { NotEmpty } from '../../../../../../src/Valkyrja/Validation/Rule/Is/NotEmpty.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('NotEmpty', () => {
    it('is valid for non-empty values', () => {
        expect(new NotEmpty('hello', ErrorMessage.IS_NOT_EMPTY).isValid()).toBe(true);
        expect(new NotEmpty(0, ErrorMessage.IS_NOT_EMPTY).isValid()).toBe(true);
        expect(new NotEmpty(false, ErrorMessage.IS_NOT_EMPTY).isValid()).toBe(true);
    });

    it('is invalid for empty string, null and undefined', () => {
        expect(new NotEmpty('', ErrorMessage.IS_NOT_EMPTY).isValid()).toBe(false);
        expect(new NotEmpty(null, ErrorMessage.IS_NOT_EMPTY).isValid()).toBe(false);
        expect(new NotEmpty(undefined, ErrorMessage.IS_NOT_EMPTY).isValid()).toBe(false);
    });

    it('validate throws for an empty value', () => {
        expect(() => {
            new NotEmpty('', ErrorMessage.IS_NOT_EMPTY).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

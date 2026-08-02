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
import { NotEqual } from '../../../../../../src/Valkyrja/Validation/Rule/Is/NotEqual.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('NotEqual', () => {
    it('is valid when the subject differs from the value', () => {
        expect(new NotEqual('a', 'b', ErrorMessage.IS_NOT_EQUAL).isValid()).toBe(true);
        expect(new NotEqual(5, '5', ErrorMessage.IS_NOT_EQUAL).isValid()).toBe(true);
    });

    it('is invalid when the subject strictly equals the value', () => {
        expect(new NotEqual('a', 'a', ErrorMessage.IS_NOT_EQUAL).isValid()).toBe(false);
        expect(new NotEqual(5, 5, ErrorMessage.IS_NOT_EQUAL).isValid()).toBe(false);
    });

    it('validate throws when equal', () => {
        expect(() => {
            new NotEqual('a', 'a', ErrorMessage.IS_NOT_EQUAL).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

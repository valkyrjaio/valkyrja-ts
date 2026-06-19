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
import { IsBool } from '../../../../../../src/Valkyrja/Validation/Rule/Is/IsBool.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('IsBool', () => {
    it('is valid for booleans', () => {
        expect(new IsBool(true, ErrorMessage.IS_BOOL).isValid()).toBe(true);
        expect(new IsBool(false, ErrorMessage.IS_BOOL).isValid()).toBe(true);
    });

    it('is invalid for non-booleans', () => {
        expect(new IsBool('true', ErrorMessage.IS_BOOL).isValid()).toBe(false);
        expect(new IsBool(1, ErrorMessage.IS_BOOL).isValid()).toBe(false);
        expect(new IsBool(null, ErrorMessage.IS_BOOL).isValid()).toBe(false);
    });

    it('validate throws for a non-boolean', () => {
        expect(() => new IsBool('x', ErrorMessage.IS_BOOL).validate()).toThrow(ValidationRuleFailureException);
    });
});

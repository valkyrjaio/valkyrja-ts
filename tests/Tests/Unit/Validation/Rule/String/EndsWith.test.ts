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
import { EndsWith } from '../../../../../../src/Valkyrja/Validation/Rule/String/EndsWith.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('EndsWith', () => {
    it('is valid when the subject ends with the needle', () => {
        expect(new EndsWith('hello world', 'world', ErrorMessage.STRING_ENDS_WITH).isValid()).toBe(true);
    });

    it('is invalid when the subject does not end with the needle', () => {
        expect(new EndsWith('hello world', 'hello', ErrorMessage.STRING_ENDS_WITH).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new EndsWith(123, 'world', ErrorMessage.STRING_ENDS_WITH).isValid()).toBe(false);
    });

    it('validate throws when the suffix is absent', () => {
        expect(() => {
            new EndsWith('hello', 'world', ErrorMessage.STRING_ENDS_WITH).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

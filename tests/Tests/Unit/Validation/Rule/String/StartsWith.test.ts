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
import { StartsWith } from '../../../../../../src/Valkyrja/Validation/Rule/String/StartsWith.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('StartsWith', () => {
    it('is valid when the subject starts with the needle', () => {
        expect(new StartsWith('hello world', 'hello', ErrorMessage.STRING_STARTS_WITH).isValid()).toBe(true);
    });

    it('is invalid when the subject does not start with the needle', () => {
        expect(new StartsWith('hello world', 'world', ErrorMessage.STRING_STARTS_WITH).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new StartsWith(123, 'hello', ErrorMessage.STRING_STARTS_WITH).isValid()).toBe(false);
    });

    it('validate throws when the prefix is absent', () => {
        expect(() => {
            new StartsWith('hello', 'world', ErrorMessage.STRING_STARTS_WITH).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

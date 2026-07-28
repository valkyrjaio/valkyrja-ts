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
import { Contains } from '../../../../../../src/Valkyrja/Validation/Rule/String/Contains.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Contains', () => {
    it('exposes the subject', () => {
        expect(new Contains('test string', 'test', ErrorMessage.STRING_CONTAINS).getSubject()).toBe('test string');
    });

    it('is valid when the subject contains the needle', () => {
        expect(new Contains('hello world', 'world', ErrorMessage.STRING_CONTAINS).isValid()).toBe(true);
        expect(new Contains('hello', 'hello', ErrorMessage.STRING_CONTAINS).isValid()).toBe(true);
    });

    it('is invalid when the subject does not contain the needle', () => {
        expect(new Contains('hello world', 'foo', ErrorMessage.STRING_CONTAINS).isValid()).toBe(false);
        expect(new Contains('hello world', 'WORLD', ErrorMessage.STRING_CONTAINS).isValid()).toBe(false);
    });

    it('is invalid for non-strings', () => {
        expect(new Contains(123, 'test', ErrorMessage.STRING_CONTAINS).isValid()).toBe(false);
        expect(new Contains(null, 'test', ErrorMessage.STRING_CONTAINS).isValid()).toBe(false);
    });

    it('validate throws when the needle is absent', () => {
        expect(() => {
            new Contains('hello world', 'foo', ErrorMessage.STRING_CONTAINS).validate();
        }).toThrow(ValidationRuleFailureException);
    });

    it('uses a custom error message', () => {
        expect(() => {
            new Contains('hello', 'world', 'Field must contain "world"').validate();
        }).toThrow('Field must contain "world"');
    });
});

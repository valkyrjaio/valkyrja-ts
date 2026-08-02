/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ValidationInvalidArgumentException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/Abstract/ValidationInvalidArgumentException.ts';
import { ValidationRuntimeException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/Abstract/ValidationRuntimeException.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Validation Throwable Exceptions', () => {
    it('ValidationRuleFailureException extends the runtime exception and Error', () => {
        const exception = new ValidationRuleFailureException('Validation failed');

        expect(exception).toBeInstanceOf(ValidationRuntimeException);
        expect(exception).toBeInstanceOf(Error);
    });

    it('retains the provided message', () => {
        const message = 'Field is required';
        const exception = new ValidationRuleFailureException(message);

        expect(exception.message).toBe(message);
    });

    it('can be thrown and caught', () => {
        expect(() => {
            throw new ValidationRuleFailureException('Must be valid');
        }).toThrow('Must be valid');
    });

    it('exposes a trace code', () => {
        const exception = new ValidationRuleFailureException('failure');

        expect(typeof exception.getTraceCode()).toBe('string');
    });

    it('is not an invalid-argument exception', () => {
        const exception = new ValidationRuleFailureException('failure');

        expect(exception).not.toBeInstanceOf(ValidationInvalidArgumentException);
    });
});

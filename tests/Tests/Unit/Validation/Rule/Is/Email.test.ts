/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../../../../../../src/Valkyrja/Validation/Constant/ErrorMessage.ts';
import { Email } from '../../../../../../src/Valkyrja/Validation/Rule/Is/Email.ts';
import { ValidationRuleFailureException } from '../../../../../../src/Valkyrja/Validation/Throwable/Exception/ValidationRuleFailureException.ts';

describe('Email', () => {
    it('is valid for well-formed email addresses', () => {
        expect(new Email('test@test.com', ErrorMessage.IS_EMAIL).isValid()).toBe(true);
        expect(new Email('user.name@example.co.uk', ErrorMessage.IS_EMAIL).isValid()).toBe(true);
    });

    it('is invalid for malformed addresses and non-strings', () => {
        expect(new Email('not-an-email', ErrorMessage.IS_EMAIL).isValid()).toBe(false);
        expect(new Email('missing@domain', ErrorMessage.IS_EMAIL).isValid()).toBe(false);
        expect(new Email('@no-local.com', ErrorMessage.IS_EMAIL).isValid()).toBe(false);
        expect(new Email(123, ErrorMessage.IS_EMAIL).isValid()).toBe(false);
    });

    it('validate throws for an invalid email', () => {
        expect(() => {
            new Email('nope', ErrorMessage.IS_EMAIL).validate();
        }).toThrow(ValidationRuleFailureException);
    });
});

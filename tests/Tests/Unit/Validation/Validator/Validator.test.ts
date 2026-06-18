/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { NotEmpty } from '../../../../../src/Valkyrja/Validation/Rule/Is/NotEmpty.ts';
import { Required } from '../../../../../src/Valkyrja/Validation/Rule/Is/Required.ts';
import { Validator } from '../../../../../src/Valkyrja/Validation/Validator/Validator.ts';

describe('Validator', () => {
    it('passes with valid data', () => {
        const validator = new Validator({
            name: [new Required('John', 'Name is required')],
        });

        expect(validator.validateRules()).toBe(true);
        expect(validator.getErrorMessages()).toStrictEqual({});
    });

    it('fails with invalid data', () => {
        const validator = new Validator({
            name: [new Required('', 'Name is required')],
        });

        expect(validator.validateRules()).toBe(false);
        expect(Object.keys(validator.getErrorMessages())).not.toHaveLength(0);
    });

    it('validates rules provided via setRules', () => {
        const validator = new Validator();

        validator.setRules({
            email: [new Required('test@test.com', 'Email is required')],
        });

        expect(validator.validateRules()).toBe(true);
        expect(validator.getErrorMessages()).toStrictEqual({});
    });

    it('fails for invalid rules provided via setRules', () => {
        const validator = new Validator();

        validator.setRules({
            email: [new Required(null, 'Email is required')],
        });

        expect(validator.validateRules()).toBe(false);
        expect(Object.keys(validator.getErrorMessages())).not.toHaveLength(0);
    });

    it('collects one error message per failing subject', () => {
        const validator = new Validator({
            name: [new Required('', 'Name is required')],
            email: [new Required(null, 'Email is required')],
        });

        validator.validateRules();

        const errors = validator.getErrorMessages();

        expect(Object.keys(errors)).toHaveLength(2);
        expect(errors).toHaveProperty('name');
        expect(errors).toHaveProperty('email');
    });

    it('returns the first error message prefixed with the subject', () => {
        const validator = new Validator({
            name: [new Required('', 'Name is required')],
            email: [new Required(null, 'Email is required')],
        });

        validator.validateRules();

        expect(validator.hasFirstErrorMessage()).toBe(true);
        expect(validator.getFirstErrorMessage()).toContain('name:');
    });

    it('reports no first error message when valid', () => {
        const validator = new Validator({
            name: [new Required('John', 'Name is required')],
        });

        validator.validateRules();

        expect(validator.hasFirstErrorMessage()).toBe(false);
        expect(validator.getFirstErrorMessage()).toBe('');
    });

    it('supports multiple rules per subject', () => {
        const validator = new Validator({
            title: [new Required('Hello', 'Title is required'), new NotEmpty('Hello', 'Title cannot be empty')],
        });

        expect(validator.validateRules()).toBe(true);
    });

    it('records a single error for multiple failing rules on one subject', () => {
        const validator = new Validator({
            title: [new Required('', 'Title is required'), new NotEmpty('', 'Title cannot be empty')],
        });

        expect(validator.validateRules()).toBe(false);
        expect(validator.getErrorMessages()).toHaveProperty('title');
    });

    it('formats error messages starting with the subject', () => {
        const validator = new Validator({
            username: [new Required('', 'Username is required')],
        });

        validator.validateRules();

        expect(validator.getErrorMessages().username).toMatch(/^username:/);
    });

    it('returns true for empty rules', () => {
        const validator = new Validator({});

        expect(validator.validateRules()).toBe(true);
        expect(validator.getErrorMessages()).toStrictEqual({});
    });
});

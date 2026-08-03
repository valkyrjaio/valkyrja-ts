/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import path from 'path';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { CopyrightHeaderFactory } from '@valkyrjaio/ci-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                // tsconfig.tests.json spans both src and tests, so a single project covers
                // everything linted. projectService would only discover tsconfig.json, which
                // excludes tests, leaving every test file unparseable.
                project: ['./tsconfig.tests.json'],
                tsconfigRootDir: path.resolve(import.meta.dirname, '../../../'),
            },
        },
        plugins: {
            local: { rules: { 'copyright-header': CopyrightHeaderFactory.getRule('Valkyrja Framework') } },
        },
        rules: {
            'local/copyright-header': 'error',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/no-unnecessary-type-parameters': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/no-invalid-void-type': ['error', { allowAsThisParameter: true }],
        },
    },
    {
        files: ['tests/**/*.ts'],
        rules: {
            // A stub is built as `{ method: vi.fn() } as unknown as SomeContract`, so `expect(
            // stub.method)` reads the method off the contract type purely to assert on the spy —
            // it is never invoked unbound. The rule only sees the declared contract type and
            // cannot tell the two apart, so it fires on every spy assertion. Off here only; the
            // rule still applies in full to src.
            '@typescript-eslint/unbound-method': 'off',
        },
    },
);

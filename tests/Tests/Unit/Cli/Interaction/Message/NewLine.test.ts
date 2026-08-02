/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { NewLine } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/NewLine.ts';

describe('NewLine', () => {
    it('carries a newline and no formatter by default', () => {
        const message = new NewLine();

        expect(message.getText()).toBe('\n');
        expect(message.hasFormatter()).toBe(false);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { WarningFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/WarningFormatter.ts';
import { WarningMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/WarningMessage.ts';

describe('WarningMessage', () => {
    it('wraps the text with a warning formatter', () => {
        const message = new WarningMessage('careful');

        expect(message.getText()).toBe('careful');
        expect(message.getFormatter()).toBeInstanceOf(WarningFormatter);
    });
});

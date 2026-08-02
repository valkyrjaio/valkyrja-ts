/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ErrorFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/ErrorFormatter.ts';
import { ErrorMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/ErrorMessage.ts';

describe('ErrorMessage', () => {
    it('wraps the text with an error formatter', () => {
        const message = new ErrorMessage('boom');

        expect(message.getText()).toBe('boom');
        expect(message.getFormatter()).toBeInstanceOf(ErrorFormatter);
    });
});

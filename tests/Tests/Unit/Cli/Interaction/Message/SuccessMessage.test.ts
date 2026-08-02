/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { SuccessFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/SuccessFormatter.ts';
import { SuccessMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/SuccessMessage.ts';

describe('SuccessMessage', () => {
    it('wraps the text with a success formatter', () => {
        const message = new SuccessMessage('done');

        expect(message.getText()).toBe('done');
        expect(message.getFormatter()).toBeInstanceOf(SuccessFormatter);
    });
});

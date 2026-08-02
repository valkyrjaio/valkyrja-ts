/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { TextColor } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/TextColor.ts';
import { TextColorFormat } from '../../../../../../src/Valkyrja/Cli/Interaction/Format/TextColorFormat.ts';
import { Formatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/Formatter.ts';
import { MessageContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/MessageContract.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { CliInteractionNoFormatterException } from '../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionNoFormatterException.ts';

describe('Message', () => {
    it('returns the raw text when there is no formatter', () => {
        const message = new Message('hello');

        expect(message.getText()).toBe('hello');
        expect(message.hasFormatter()).toBe(false);
        expect(message.getFormattedText()).toBe('hello');
    });

    it('formats the text when a formatter is set', () => {
        const formatter = new Formatter(new TextColorFormat(TextColor.RED));
        const message = new Message('hello', formatter);

        expect(message.hasFormatter()).toBe(true);
        expect(message.getFormatter()).toBe(formatter);
        expect(message.getFormattedText()).toBe(formatter.formatText('hello'));
    });

    it('getFormatter throws when no formatter is set', () => {
        expect(() => new Message('hello').getFormatter()).toThrow(CliInteractionNoFormatterException);
    });

    it('withText returns an immutable clone with the new text', () => {
        const message = new Message('hello');
        const next = message.withText('world');

        expect(next).not.toBe(message);
        expect(message.getText()).toBe('hello');
        expect(next.getText()).toBe('world');
    });

    it('withFormatter and withoutFormatter return immutable clones', () => {
        const message = new Message('hello');

        const withFormatter = message.withFormatter(new Formatter());
        expect(withFormatter).not.toBe(message);
        expect(withFormatter.hasFormatter()).toBe(true);

        const withoutFormatter = withFormatter.withoutFormatter();
        expect(withoutFormatter).not.toBe(withFormatter);
        expect(withoutFormatter.hasFormatter()).toBe(false);
    });

    it('instanceOf is true for a Message and false otherwise', () => {
        expect(MessageContract.instanceOf(new Message('hello'))).toBe(true);
        expect(MessageContract.instanceOf(null)).toBe(false);
        expect(MessageContract.instanceOf({})).toBe(false);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it, vi } from 'vitest';

import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { InputReceivedHandler } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/InputReceivedHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

describe('InputReceivedHandler', () => {
    it('passes the input through when there is no middleware', () => {
        const input = new Input();

        expect(new InputReceivedHandler(new Container()).inputReceived(input)).toBe(input);
    });

    it('delegates to the next middleware resolved from the container', () => {
        const output = new Output();
        const container = new Container();
        const middleware = { inputReceived: vi.fn(() => output) };
        container.setSingleton('mw', middleware);

        expect(new InputReceivedHandler(container, 'mw').inputReceived(new Input())).toBe(output);
        expect(middleware.inputReceived).toHaveBeenCalledTimes(1);
    });

    it('appends middleware to the chain via add', () => {
        const output = new Output();
        const container = new Container();
        container.setSingleton('mw', { inputReceived: vi.fn(() => output) });

        const handler = new InputReceivedHandler(container);
        handler.add('mw');

        expect(handler.inputReceived(new Input())).toBe(output);
    });
});

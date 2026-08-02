/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { Controller } from '../../../../../../src/Valkyrja/Cli/Routing/Controller/Controller.ts';

import type { InputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { OutputFactoryContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/Contract/OutputFactoryContract.ts';

class TestController extends Controller {
    getInput(): InputContract {
        return this.input;
    }

    getOutputFactory(): OutputFactoryContract {
        return this.outputFactory;
    }
}

describe('Controller', () => {
    it('stores the input and output factory it was constructed with', () => {
        const input = new Input();
        const outputFactory = new OutputFactory(new CliInteractionConfig());

        const controller = new TestController(input, outputFactory);

        expect(controller.getInput()).toBe(input);
        expect(controller.getOutputFactory()).toBe(outputFactory);
    });
});

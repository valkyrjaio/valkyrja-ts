/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliConfig } from '../../../../../../src/Valkyrja/Application/Data/CliConfig.ts';
import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { VersionCommand } from '../../../../../../src/Valkyrja/Cli/Server/Command/VersionCommand.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const handler = (): OutputContract => new OutputFactory().createOutput();

function textOf(output: OutputContract): string {
    return output
        .getMessages()
        .map((message) => message.getText())
        .join('');
}

describe('VersionCommand', () => {
    it('renders a header with the application version', () => {
        const route = new Route('version', 'desc', handler);
        const output = new VersionCommand(new OutputFactory(new CliInteractionConfig()), new CliConfig(), route).run();

        expect(textOf(output)).toContain('╭── App');
    });

    it('exposes help text', () => {
        expect(VersionCommand.help().getText()).toContain('version');
    });
});

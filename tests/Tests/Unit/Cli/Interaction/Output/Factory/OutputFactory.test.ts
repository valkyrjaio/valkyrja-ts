/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { PassThrough } from 'node:stream';

import { describe, expect, it } from 'vitest';

import { CliInteractionConfig } from '../../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { ExitCode } from '../../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { EmptyOutput } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/EmptyOutput.ts';
import { OutputFactory } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { FileOutput } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/FileOutput.ts';
import { Output } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { PlainOutput } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/PlainOutput.ts';
import { StreamOutput } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/StreamOutput.ts';

describe('OutputFactory', () => {
    const factory = new OutputFactory(new CliInteractionConfig(false, true, false));

    it('creates a standard output', () => {
        expect(factory.createOutput(ExitCode.SUCCESS)).toBeInstanceOf(Output);
    });

    it('creates an empty output', () => {
        expect(factory.createEmptyOutput()).toBeInstanceOf(EmptyOutput);
    });

    it('creates a plain output', () => {
        expect(factory.createPlainOutput()).toBeInstanceOf(PlainOutput);
    });

    it('creates a file output for the given path', () => {
        const output = factory.createFileOutput('/tmp/out.log');

        expect(output).toBeInstanceOf(FileOutput);
        expect(output.getFilepath()).toBe('/tmp/out.log');
    });

    it('creates a stream output for the given stream', () => {
        const stream = new PassThrough();
        const output = factory.createStreamOutput(stream);

        expect(output).toBeInstanceOf(StreamOutput);
        expect(output.getStream()).toBe(stream);
    });

    it('uses a default config when none is provided', () => {
        expect(new OutputFactory().createOutput()).toBeInstanceOf(Output);
    });
});

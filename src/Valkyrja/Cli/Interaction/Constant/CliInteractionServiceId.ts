/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class CliInteractionServiceId {
    static readonly CliInteractionConfigContract =
        'Valkyrja.Cli.Interaction.Data.CliInteractionConfigContract' as const;
    static readonly OutputFactoryContract = 'Valkyrja.Cli.Interaction.Output.Factory.OutputFactoryContract' as const;
    static readonly InputContract = 'Valkyrja.Cli.Interaction.Input.InputContract' as const;
    static readonly OutputContract = 'Valkyrja.Cli.Interaction.Output.OutputContract' as const;
}

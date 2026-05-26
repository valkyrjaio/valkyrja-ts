/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class CliInteractionServiceId {
    static readonly CliInteractionConfigContract =
        'Valkyrja.Cli.Interaction.Data.CliInteractionConfigContract' as const;
    static readonly OutputFactoryContract = 'Valkyrja.Cli.Interaction.Output.Factory.OutputFactoryContract' as const;
    static readonly InputContract = 'Valkyrja.Cli.Interaction.Input.InputContract' as const;
    static readonly OutputContract = 'Valkyrja.Cli.Interaction.Output.OutputContract' as const;
}

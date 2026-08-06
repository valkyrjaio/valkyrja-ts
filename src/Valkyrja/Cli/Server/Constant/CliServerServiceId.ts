/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class CliServerServiceId {
    static readonly InputHandlerContract = 'Valkyrja.Cli.Server.Handler.InputHandlerContract' as const;
    static readonly HelpCommand = 'Valkyrja.Cli.Server.Command.HelpCommand' as const;
    static readonly ListBashCommand = 'Valkyrja.Cli.Server.Command.ListBashCommand' as const;
    static readonly ListCommand = 'Valkyrja.Cli.Server.Command.ListCommand' as const;
    static readonly VersionCommand = 'Valkyrja.Cli.Server.Command.VersionCommand' as const;
    static readonly LogThrowableCaughtMiddleware =
        'Valkyrja.Cli.Server.Middleware.ThrowableCaught.LogThrowableCaughtMiddleware' as const;
    static readonly OutputThrowableCaughtMiddleware =
        'Valkyrja.Cli.Server.Middleware.ThrowableCaught.OutputThrowableCaughtMiddleware' as const;
    static readonly CheckForHelpOptionsMiddleware =
        'Valkyrja.Cli.Server.Middleware.InputReceived.CheckForHelpOptionsMiddleware' as const;
    static readonly CheckForVersionOptionsMiddleware =
        'Valkyrja.Cli.Server.Middleware.InputReceived.CheckForVersionOptionsMiddleware' as const;
    static readonly CheckGlobalInteractionOptionsMiddleware =
        'Valkyrja.Cli.Server.Middleware.InputReceived.CheckGlobalInteractionOptionsMiddleware' as const;
    static readonly CheckCommandForTypoMiddleware =
        'Valkyrja.Cli.Server.Middleware.RouteNotMatched.CheckCommandForTypoMiddleware' as const;
}

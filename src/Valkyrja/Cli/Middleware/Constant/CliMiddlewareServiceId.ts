/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class CliMiddlewareServiceId {
    static readonly InputReceivedHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.InputReceivedHandlerContract' as const;
    static readonly RouteMatchedHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.RouteMatchedHandlerContract' as const;
    static readonly RouteNotMatchedHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.RouteNotMatchedHandlerContract' as const;
    static readonly RouteDispatchedHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.RouteDispatchedHandlerContract' as const;
    static readonly ThrowableCaughtHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.ThrowableCaughtHandlerContract' as const;
    static readonly ProcessExitingHandlerContract =
        'Valkyrja.Cli.Middleware.Handler.ProcessExitingHandlerContract' as const;
}

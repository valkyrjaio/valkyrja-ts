/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class HttpServerServiceId {
    static readonly RequestHandlerContract = 'Valkyrja.Http.Server.Handler.RequestHandlerContract' as const;
    static readonly ExceptionResponseHandlerContract =
        'Valkyrja.Http.Server.Handler.ExceptionResponseRequestHandlerContract' as const;
}

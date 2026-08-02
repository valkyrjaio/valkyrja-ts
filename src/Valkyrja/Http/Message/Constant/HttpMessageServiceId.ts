/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class HttpMessageServiceId {
    static readonly ServerRequestContract = 'Valkyrja.Http.Message.Request.ServerRequestContract' as const;
    static readonly ResponseFactoryContract = 'Valkyrja.Http.Message.Response.Factory.ResponseFactoryContract' as const;
}

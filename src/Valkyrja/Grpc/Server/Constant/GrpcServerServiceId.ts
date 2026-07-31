/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class GrpcServerServiceId {
    static readonly ServiceHandlerContract = 'Valkyrja.Grpc.Server.Handler.ServiceHandlerContract' as const;
    static readonly ServiceAdapterContract = 'Valkyrja.Grpc.Server.Adapter.ServiceAdapterContract' as const;
}

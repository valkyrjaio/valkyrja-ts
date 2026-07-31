/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class GrpcMessageServiceId {
    static readonly ServiceCallContract = 'Valkyrja.Grpc.Message.Call.ServiceCallContract' as const;
    static readonly ServiceResponseContract = 'Valkyrja.Grpc.Message.Response.ServiceResponseContract' as const;
}

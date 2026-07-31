/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/Abstract/ComponentProvider.ts';
import { GrpcRouteProviderFixture } from './GrpcRouteProviderFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { GrpcRouteProviderContract } from '../../../../../src/Valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';

export class GrpcRouteComponentProviderFixture extends ComponentProvider {
    override getGrpcProviders(_app: ApplicationContract): GrpcRouteProviderContract[] {
        return [new GrpcRouteProviderFixture()];
    }
}

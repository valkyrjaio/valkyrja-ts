/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceProviderContract } from '../../Provider/Contract/ServiceProviderContract.ts';

export interface ProvidersAwareContract {
    register(provider: ServiceProviderContract): void;
    isDeferred(id: string): boolean;
    isPublished(id: string): boolean;
    publish(id: string): void;
}

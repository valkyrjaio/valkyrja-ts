/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { ContainerContract } from '../../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';

export class CliContainerDataProviderFixture implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {};
    }
}

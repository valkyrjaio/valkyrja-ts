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

export class ProviderClass implements ServiceProviderContract {
    static readonly PROVIDED_ID = 'ProvidedClass';
    static readonly PROVIDED_SECONDARY_ID = 'ProvidedSecondaryClass';
    static publishCalled = false;
    static publishSecondaryCalled = false;

    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ProviderClass.PROVIDED_ID]: (): void => {
                ProviderClass.publishCalled = true;
            },
            [ProviderClass.PROVIDED_SECONDARY_ID]: (): void => {
                ProviderClass.publishSecondaryCalled = true;
            },
        };
    }
}

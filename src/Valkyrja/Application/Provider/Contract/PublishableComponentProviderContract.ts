/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.js';

export interface PublishableComponentProviderContract {
    publish(app: ApplicationContract): void;
}

export namespace PublishableComponentProviderContract {
    export function instanceOf(value: unknown): value is PublishableComponentProviderContract {
        return typeof value === 'object' && value !== null && 'publish' in value;
    }
}

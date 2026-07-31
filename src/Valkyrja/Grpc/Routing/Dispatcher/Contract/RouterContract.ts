/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';

/**
 * Resolves an inbound call to a `Route` via a direct service-map lookup and dispatches it. The
 * component keeps the `Router` name for consistency with HTTP and CLI; only the resolution strategy
 * (map lookup, no pattern matching) differs.
 */
export interface RouterContract {
    dispatch(call: ServiceCallContract): Promise<ServiceResponseContract>;
}

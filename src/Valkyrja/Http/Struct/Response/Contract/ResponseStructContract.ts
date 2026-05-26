/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { StructContract } from '../../Contract/StructContract.js';

export interface ResponseStructContract extends StructContract {
    getStructuredData(data: Record<string, unknown>, includeAll?: boolean): Record<string | number, unknown>;
}

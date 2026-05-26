/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseFactoryContract } from '../../Message/Response/Factory/Contract/ResponseFactoryContract.js';

export abstract class Controller {
    constructor(
        protected request: ServerRequestContract,
        protected responseFactory: ResponseFactoryContract,
    ) {}
}

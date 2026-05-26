/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.js';

export abstract class Controller {
    constructor(
        protected input: InputContract,
        protected outputFactory: OutputFactoryContract,
    ) {}
}

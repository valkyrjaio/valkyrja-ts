/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { EmptyResponseContract } from './Contract/EmptyResponseContract.ts';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.ts';
import { Response } from './Response.ts';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.ts';
import { Stream } from '../Stream/Stream.ts';
import { Mode } from '../Stream/Enum/Mode.ts';
import { StatusCode } from '../Enum/StatusCode.ts';

export class EmptyResponse extends Response implements EmptyResponseContract {
    constructor(headers: HeaderCollectionContract = new HeaderCollection()) {
        super(new Stream('', Mode.READ), StatusCode.NO_CONTENT, headers);
    }
}

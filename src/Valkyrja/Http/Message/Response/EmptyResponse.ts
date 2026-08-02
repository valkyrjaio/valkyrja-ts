/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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

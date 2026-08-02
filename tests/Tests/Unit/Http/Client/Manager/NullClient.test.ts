/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { EmptyResponse } from '../../../../../../src/Valkyrja/Http/Message/Response/EmptyResponse.ts';
import { NullClient } from '../../../../../../src/Valkyrja/Http/Client/Manager/NullClient.ts';

import type { RequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/RequestContract.ts';

describe('NullClient', () => {
    it('returns an empty response for any request', () => {
        expect(new NullClient().sendRequest({} as RequestContract)).toBeInstanceOf(EmptyResponse);
    });
});

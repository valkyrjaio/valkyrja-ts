/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

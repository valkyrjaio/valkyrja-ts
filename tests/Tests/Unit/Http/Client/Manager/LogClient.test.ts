/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { EmptyResponse } from '../../../../../../src/Valkyrja/Http/Message/Response/EmptyResponse.ts';
import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { LogClient } from '../../../../../../src/Valkyrja/Http/Client/Manager/LogClient.ts';

import type { RequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/RequestContract.ts';
import type { LoggerContract } from '../../../../../../src/Valkyrja/Log/Logger/Contract/LoggerContract.ts';

describe('LogClient', () => {
    it('logs the request and returns an empty response', () => {
        const logger = { info: vi.fn() } as unknown as LoggerContract;
        const request = {
            getMethod: () => RequestMethod.GET,
            getUri: () => ({ toString: () => 'http://example.com' }),
        } as unknown as RequestContract;

        const response = new LogClient(logger).sendRequest(request);

        expect(logger.info).toHaveBeenCalledTimes(1);
        expect(response).toBeInstanceOf(EmptyResponse);
    });
});

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HttpConfigContract } from '../../../../../../src/Valkyrja/Application/Data/Contract/HttpConfigContract.ts';

describe('HttpConfigContract', () => {
    it('instanceOf is true for an object exposing requestReceivedMiddleware', () => {
        expect(HttpConfigContract.instanceOf({ requestReceivedMiddleware: [] })).toBe(true);
    });

    it('instanceOf is false for non-configs', () => {
        expect(HttpConfigContract.instanceOf(null)).toBe(false);
        expect(HttpConfigContract.instanceOf({})).toBe(false);
    });
});

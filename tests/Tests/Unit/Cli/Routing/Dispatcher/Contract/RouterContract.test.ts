/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouterContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Contract/RouterContract.ts';

describe('RouterContract', () => {
    it('instanceOf is true for an object exposing dispatch', () => {
        expect(RouterContract.instanceOf({ dispatch: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouterContract.instanceOf(null)).toBe(false);
        expect(RouterContract.instanceOf({})).toBe(false);
    });
});

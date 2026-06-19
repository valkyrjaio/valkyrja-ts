/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';

describe('RouteContract', () => {
    it('instanceOf is true for an object exposing getName', () => {
        expect(RouteContract.instanceOf({ getName: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteContract.instanceOf(null)).toBe(false);
        expect(RouteContract.instanceOf({})).toBe(false);
    });
});

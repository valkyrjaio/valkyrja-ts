/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteCollectionContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Collection/Contract/RouteCollectionContract.ts';

describe('RouteCollectionContract', () => {
    it('instanceOf is true for an object exposing getData', () => {
        expect(RouteCollectionContract.instanceOf({ getData: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteCollectionContract.instanceOf(null)).toBe(false);
        expect(RouteCollectionContract.instanceOf({})).toBe(false);
    });
});

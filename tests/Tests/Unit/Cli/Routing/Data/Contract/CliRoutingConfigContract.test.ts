/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliRoutingConfigContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/CliRoutingConfigContract.ts';

describe('CliRoutingConfigContract', () => {
    it('instanceOf is true for an object exposing dataClassName', () => {
        expect(CliRoutingConfigContract.instanceOf({ dataClassName: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliRoutingConfigContract.instanceOf(null)).toBe(false);
        expect(CliRoutingConfigContract.instanceOf({})).toBe(false);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { EmptyOutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/EmptyOutputContract.ts';

describe('EmptyOutputContract', () => {
    it('instanceOf is true for an object exposing getMessages', () => {
        expect(EmptyOutputContract.instanceOf({ getMessages: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(EmptyOutputContract.instanceOf(null)).toBe(false);
        expect(EmptyOutputContract.instanceOf({})).toBe(false);
    });
});

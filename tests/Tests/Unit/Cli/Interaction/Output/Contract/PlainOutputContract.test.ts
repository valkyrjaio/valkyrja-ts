/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { PlainOutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/PlainOutputContract.ts';

describe('PlainOutputContract', () => {
    it('instanceOf is true for an object exposing getMessages', () => {
        expect(PlainOutputContract.instanceOf({ getMessages: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(PlainOutputContract.instanceOf(null)).toBe(false);
        expect(PlainOutputContract.instanceOf({})).toBe(false);
    });
});

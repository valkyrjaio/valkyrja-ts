/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { FileOutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/FileOutputContract.ts';

describe('FileOutputContract', () => {
    it('instanceOf is true for an object exposing getFilepath', () => {
        expect(FileOutputContract.instanceOf({ getFilepath: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(FileOutputContract.instanceOf(null)).toBe(false);
        expect(FileOutputContract.instanceOf({})).toBe(false);
    });
});

/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { InputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';

describe('InputContract', () => {
    it('instanceOf is true for an object exposing getCaller', () => {
        expect(InputContract.instanceOf({ getCaller: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(InputContract.instanceOf(null)).toBe(false);
        expect(InputContract.instanceOf({})).toBe(false);
    });
});

/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { FormatterContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Formatter/Contract/FormatterContract.ts';

describe('FormatterContract', () => {
    it('instanceOf is true for an object exposing formatText', () => {
        expect(FormatterContract.instanceOf({ formatText: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(FormatterContract.instanceOf(null)).toBe(false);
        expect(FormatterContract.instanceOf({})).toBe(false);
    });
});

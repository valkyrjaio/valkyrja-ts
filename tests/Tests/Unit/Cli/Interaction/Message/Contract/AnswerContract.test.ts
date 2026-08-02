/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AnswerContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/AnswerContract.ts';

describe('AnswerContract', () => {
    it('instanceOf is true for an object exposing getUserResponse', () => {
        expect(AnswerContract.instanceOf({ getUserResponse: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(AnswerContract.instanceOf(null)).toBe(false);
        expect(AnswerContract.instanceOf({})).toBe(false);
    });
});

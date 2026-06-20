/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AnswerContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/AnswerContract.ts';
import { Answer } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Answer.ts';
import { CliInteractionNoValidationCallableException } from '../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionNoValidationCallableException.ts';

describe('Answer', () => {
    it('defaults the user response to the default response and includes it in allowed responses', () => {
        const answer = new Answer('yes');

        expect(answer.getDefaultResponse()).toBe('yes');
        expect(answer.getUserResponse()).toBe('yes');
        expect(answer.getAllowedResponses()).toContain('yes');
        expect(answer.hasBeenAnswered()).toBe(false);
    });

    it('keeps an explicitly allowed response and adds the default once', () => {
        const answer = new Answer('yes', null, false, 'You answered: `%s`', null, ['no']);

        expect(answer.getAllowedResponses()).toStrictEqual(['no', 'yes']);
    });

    it('renders the text with the user response substituted', () => {
        const answer = new Answer('yes');

        expect(answer.getText()).toBe('You answered: `yes`');
    });

    it('withDefaultResponse updates the user response only when unanswered', () => {
        const unanswered = new Answer('yes');
        const updated = unanswered.withDefaultResponse('no');

        expect(updated.getDefaultResponse()).toBe('no');
        expect(updated.getUserResponse()).toBe('no');
        expect(updated.getAllowedResponses()).toContain('no');

        const answered = new Answer('yes').withUserResponse('maybe');
        const keepsResponse = answered.withDefaultResponse('no');

        expect(keepsResponse.getUserResponse()).toBe('maybe');
    });

    it('withAllowedResponses replaces the list but keeps the default response', () => {
        const answer = new Answer('yes');
        const updated = answer.withAllowedResponses('a', 'b');

        expect(updated.getAllowedResponses()).toStrictEqual(['a', 'b', 'yes']);

        const withDefault = answer.withAllowedResponses('yes', 'b');
        expect(withDefault.getAllowedResponses()).toStrictEqual(['yes', 'b']);
    });

    it('withUserResponse marks the answer as answered', () => {
        const answer = new Answer('yes').withUserResponse('no');

        expect(answer.getUserResponse()).toBe('no');
        expect(answer.hasBeenAnswered()).toBe(true);
    });

    it('manages the validation callable', () => {
        const answer = new Answer('yes');

        expect(answer.hasValidationCallable()).toBe(false);
        expect(() => answer.getValidationCallable()).toThrow(CliInteractionNoValidationCallableException);

        const withCallable = answer.withValidationCallable((response) => response === 'yes');
        expect(withCallable.hasValidationCallable()).toBe(true);
        expect(withCallable.getValidationCallable()('yes')).toBe(true);

        const withoutCallable = withCallable.withoutValidationCallable();
        expect(withoutCallable.hasValidationCallable()).toBe(false);
    });

    it('withHasBeenAnswered toggles the answered flag', () => {
        const answer = new Answer('yes').withHasBeenAnswered(true);

        expect(answer.hasBeenAnswered()).toBe(true);
    });

    it('validates the response against allowed responses and the callable', () => {
        expect(new Answer('yes').isValidResponse()).toBe(true);

        const rejected = new Answer('yes').withUserResponse('nope');
        expect(rejected.isValidResponse()).toBe(false);

        const viaCallable = new Answer('yes')
            .withValidationCallable((response) => response === 'nope')
            .withUserResponse('nope');
        expect(viaCallable.isValidResponse()).toBe(true);
    });

    it('does not duplicate the default response when it is already allowed', () => {
        const answer = new Answer('yes', null, false, 'You answered: `%s`', null, ['yes', 'no']);

        expect(answer.getAllowedResponses()).toStrictEqual(['yes', 'no']);
    });

    it('withDefaultResponse does not duplicate an already-allowed default', () => {
        const answer = new Answer('yes').withDefaultResponse('yes');

        expect(answer.getAllowedResponses()).toStrictEqual(['yes']);
    });

    it('treats any response as valid when there are no allowed responses or validation callable', () => {
        // The public constructor always keeps the default response, so force an empty list.
        class EmptyAllowedAnswer extends Answer {
            constructor() {
                super('yes');
                this.allowedResponses = [];
            }
        }

        expect(new EmptyAllowedAnswer().withUserResponse('anything').isValidResponse()).toBe(true);
    });

    it('instanceOf is true for an Answer and false otherwise', () => {
        expect(AnswerContract.instanceOf(new Answer('yes'))).toBe(true);
        expect(AnswerContract.instanceOf(null)).toBe(false);
        expect(AnswerContract.instanceOf({})).toBe(false);
    });
});

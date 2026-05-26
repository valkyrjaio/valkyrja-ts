/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MessageContract } from './MessageContract.js';

export interface AnswerContract extends MessageContract {
    getDefaultResponse(): string;
    withDefaultResponse(defaultResponse: string): this;
    getAllowedResponses(): string[];
    withAllowedResponses(...allowedResponses: string[]): this;
    getUserResponse(): string;
    withUserResponse(userResponse: string): this;
    hasValidationCallable(): boolean;
    getValidationCallable(): (response: string) => boolean;
    withValidationCallable(validationCallable: (response: string) => boolean): this;
    withoutValidationCallable(): this;
    hasBeenAnswered(): boolean;
    withHasBeenAnswered(hasBeenAnswered: boolean): this;
    isValidResponse(): boolean;
}

export namespace AnswerContract {
    export function instanceOf(value: unknown): value is AnswerContract {
        return typeof value === 'object' && value !== null && 'getUserResponse' in value;
    }
}

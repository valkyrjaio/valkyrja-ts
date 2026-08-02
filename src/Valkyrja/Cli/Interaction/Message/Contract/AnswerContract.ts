/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from './MessageContract.ts';

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

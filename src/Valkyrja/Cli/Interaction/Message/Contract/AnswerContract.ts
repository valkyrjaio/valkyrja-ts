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
import type { FormatterContract } from '../Formatter/Contract/FormatterContract.js';
import type { AnswerContract } from './Contract/AnswerContract.js';
import { CliInteractionNoValidationCallableException } from '../Throwable/Exception/CliInteractionNoValidationCallableException.js';
import { Message } from './Message.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

export class Answer extends Message implements AnswerContract {
    protected userResponse: string;
    protected allowedResponses: string[];

    constructor(
        protected defaultResponse: string,
        protected validationCallable: ((response: string) => boolean) | null = null,
        protected answeredFlag: boolean = false,
        text: string = 'You answered: `%s`',
        formatter: FormatterContract | null = null,
        allowedResponses: string[] = [],
    ) {
        if (!allowedResponses.includes(defaultResponse)) {
            allowedResponses = [...allowedResponses, defaultResponse];
        }

        super(text, formatter);

        this.userResponse     = defaultResponse;
        this.allowedResponses = allowedResponses;
    }

    override getText(): string {
        return this.text.replace('%s', this.userResponse);
    }

    getDefaultResponse(): string {
        return this.defaultResponse;
    }

    withDefaultResponse(defaultResponse: string): this {
        const clone           = ObjectFactory.clone(this);
        clone.defaultResponse = defaultResponse;

        if (!clone.answeredFlag) {
            clone.userResponse = defaultResponse;
        }

        if (!clone.allowedResponses.includes(defaultResponse)) {
            clone.allowedResponses = [...clone.allowedResponses, defaultResponse];
        }

        return clone;
    }

    getAllowedResponses(): string[] {
        return this.allowedResponses;
    }

    withAllowedResponses(...allowedResponses: string[]): this {
        const clone              = ObjectFactory.clone(this);
        clone.allowedResponses   = allowedResponses;

        if (!clone.allowedResponses.includes(clone.defaultResponse)) {
            clone.allowedResponses = [...clone.allowedResponses, clone.defaultResponse];
        }

        return clone;
    }

    getUserResponse(): string {
        return this.userResponse;
    }

    withUserResponse(userResponse: string): this {
        const clone          = ObjectFactory.clone(this);
        clone.userResponse   = userResponse;
        clone.answeredFlag   = true;
        return clone;
    }

    hasValidationCallable(): boolean {
        return this.validationCallable !== null;
    }

    getValidationCallable(): (response: string) => boolean {
        if (this.validationCallable === null) {
            throw new CliInteractionNoValidationCallableException('No validation callable has been set');
        }
        return this.validationCallable;
    }

    withValidationCallable(validationCallable: (response: string) => boolean): this {
        const clone               = ObjectFactory.clone(this);
        clone.validationCallable  = validationCallable;
        return clone;
    }

    withoutValidationCallable(): this {
        const clone               = ObjectFactory.clone(this);
        clone.validationCallable  = null;
        return clone;
    }

    hasBeenAnswered(): boolean {
        return this.answeredFlag;
    }

    withHasBeenAnswered(hasBeenAnswered: boolean): this {
        const clone          = ObjectFactory.clone(this);
        clone.answeredFlag   = hasBeenAnswered;
        return clone;
    }

    isValidResponse(): boolean {
        const validationCallable = this.validationCallable;
        const userResponse       = this.userResponse;

        return (
            (this.allowedResponses.length === 0 && validationCallable === null)
            || this.allowedResponses.includes(userResponse)
            || (validationCallable !== null && validationCallable(userResponse))
        );
    }
}

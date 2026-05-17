import type { ArgumentContract } from '../../Interaction/Argument/Contract/ArgumentContract.js';
import type { ArgumentParameterContract } from './Contract/ArgumentParameterContract.js';
import type { Cast } from '../../../Type/Data/Cast.js';
import { ArgumentMode } from '../Enum/ArgumentMode.js';
import { ArgumentValueMode } from '../Enum/ArgumentValueMode.js';
import { CliRoutingArgumentValuesValidationException } from '../Throwable/Exception/CliRoutingArgumentValuesValidationException.js';
import { Parameter } from './Abstract/Parameter.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

export class ArgumentParameter extends Parameter implements ArgumentParameterContract {
    constructor(
        name: string,
        description: string,
        cast: Cast | null = null,
        protected mode: ArgumentMode = ArgumentMode.OPTIONAL,
        protected valueMode: ArgumentValueMode = ArgumentValueMode.DEFAULT,
        protected arguments_: ArgumentContract[] = [],
    ) {
        super(name, description, cast);
    }

    getMode(): ArgumentMode {
        return this.mode;
    }

    withMode(mode: ArgumentMode): this {
        const clone  = ObjectFactory.clone(this);
        clone.mode   = mode;
        return clone;
    }

    getValueMode(): ArgumentValueMode {
        return this.valueMode;
    }

    withValueMode(valueMode: ArgumentValueMode): this {
        const clone       = ObjectFactory.clone(this);
        clone.valueMode   = valueMode;
        return clone;
    }

    getArguments(): ArgumentContract[] {
        return this.arguments_;
    }

    withArguments(...arguments_: ArgumentContract[]): this {
        const clone      = ObjectFactory.clone(this);
        clone.arguments_ = arguments_;
        return clone;
    }

    withAddedArguments(...arguments_: ArgumentContract[]): this {
        const clone      = ObjectFactory.clone(this);
        clone.arguments_ = [...this.arguments_, ...arguments_];
        return clone;
    }

    getCastValues(): unknown[] {
        return this.getCastValuesForParameters(this.arguments_);
    }

    hasFirstValue(): boolean {
        return this.arguments_.length > 0;
    }

    getFirstValue(): string {
        return this.arguments_[0]?.getValue() ?? '';
    }

    areValuesValid(): boolean {
        let valid = true;

        if (this.mode === ArgumentMode.REQUIRED) {
            valid = this.arguments_.length > 0;
        }

        if (this.valueMode === ArgumentValueMode.DEFAULT) {
            valid = valid && this.arguments_.length <= 1;
        }

        return valid;
    }

    validateValues(): this {
        if (!this.areValuesValid()) {
            throw new CliRoutingArgumentValuesValidationException(`${this.name} is invalid`);
        }
        return this;
    }
}

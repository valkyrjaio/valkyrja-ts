/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ArgumentContract } from '../../Interaction/Argument/Contract/ArgumentContract.ts';
import type { ArgumentParameterContract } from './Contract/ArgumentParameterContract.ts';
import type { Cast } from '../../../Type/Data/Cast.ts';
import { ArgumentMode } from '../Enum/ArgumentMode.ts';
import { ArgumentValueMode } from '../Enum/ArgumentValueMode.ts';
import { CliRoutingArgumentValuesValidationException } from '../Throwable/Exception/CliRoutingArgumentValuesValidationException.ts';
import { Parameter } from './Abstract/Parameter.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

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
        const clone = ObjectFactory.clone(this);
        clone.mode = mode;
        return clone;
    }

    getValueMode(): ArgumentValueMode {
        return this.valueMode;
    }

    withValueMode(valueMode: ArgumentValueMode): this {
        const clone = ObjectFactory.clone(this);
        clone.valueMode = valueMode;
        return clone;
    }

    getArguments(): ArgumentContract[] {
        return this.arguments_;
    }

    withArguments(...arguments_: ArgumentContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.arguments_ = arguments_;
        return clone;
    }

    withAddedArguments(...arguments_: ArgumentContract[]): this {
        const clone = ObjectFactory.clone(this);
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

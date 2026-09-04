/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Container } from '../../../Container/Manager/Container.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { TypeContract } from '../../../Type/Contract/TypeContract.ts';
import type { ParameterContract } from '../Data/Contract/ParameterContract.ts';
import type { CasterContract } from './Contract/CasterContract.ts';

export class Caster implements CasterContract {
    constructor(protected container: ContainerContract = new Container()) {}

    getCastValues(parameter: ParameterContract): unknown[] {
        const values = parameter.getValues();

        if (!parameter.hasCast()) {
            return values;
        }

        const cast = parameter.getCast();

        return values.map((value) => {
            const type = this.container.getService<TypeContract>(cast.type, [value]);

            return cast.convert ? type.asValue() : type;
        });
    }
}

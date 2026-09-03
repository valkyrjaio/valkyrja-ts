/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ContainerInvalidArgumentException } from './Abstract/ContainerInvalidArgumentException.ts';

export class ContainerCyclicAliasException extends ContainerInvalidArgumentException {
    constructor(alias: string, from: string, to: string, options?: ErrorOptions) {
        super(`Alias \`${alias}\` follows a cyclic chain. \`${from}\` points back to \`${to}\`.`, options);
        this.name = 'ContainerCyclicAliasException';
    }
}

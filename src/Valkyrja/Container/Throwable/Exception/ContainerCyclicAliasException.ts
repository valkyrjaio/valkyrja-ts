/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ContainerInvalidArgumentException } from './Abstract/ContainerInvalidArgumentException.ts';

export class ContainerCyclicAliasException extends ContainerInvalidArgumentException {
    constructor(alias: string, id: string, options?: ErrorOptions) {
        super(
            `Alias \`${alias}\` cannot point at \`${id}\`, because \`${id}\` already resolves to \`${alias}\`.`,
            options,
        );
        this.name = 'ContainerCyclicAliasException';
    }
}

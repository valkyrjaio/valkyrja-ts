/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ContainerInvalidArgumentException } from './Abstract/ContainerInvalidArgumentException.ts';

export class ContainerInvalidReferenceException extends ContainerInvalidArgumentException {
    constructor(id: string, options?: ErrorOptions) {
        super(`Service with \`${id}\` not found`, options);
        this.name = 'ContainerInvalidReferenceException';
    }
}

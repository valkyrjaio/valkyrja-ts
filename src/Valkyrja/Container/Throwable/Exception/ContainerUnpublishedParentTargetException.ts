/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ContainerRuntimeException } from './Abstract/ContainerRuntimeException.ts';

export class ContainerUnpublishedParentTargetException extends ContainerRuntimeException {
    constructor(id: string, options?: ErrorOptions) {
        super(
            `\`${id}\` is registered in the parent container and its publish callback has not run. ` +
                'Resolve or publish it in bootstrapParentServices(), or give the child the publish callbacks.',
            options,
        );
        this.name = 'ContainerUnpublishedParentTargetException';
    }
}

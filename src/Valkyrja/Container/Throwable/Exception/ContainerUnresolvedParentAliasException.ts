/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ContainerRuntimeException } from './Abstract/ContainerRuntimeException.ts';

export class ContainerUnresolvedParentAliasException extends ContainerRuntimeException {
    constructor(alias: string, reachedId: string, options?: ErrorOptions) {
        super(
            `Alias \`${alias}\` reaches \`${reachedId}\`, which the parent container has not resolved. ` +
                'Resolve or publish it in bootstrapParentServices() before the request loop begins.',
            options,
        );
        this.name = 'ContainerUnresolvedParentAliasException';
    }
}

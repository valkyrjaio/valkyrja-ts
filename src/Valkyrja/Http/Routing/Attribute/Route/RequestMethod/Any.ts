/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { allRequestMethods } from '../../../../Message/Enum/RequestMethod.ts';
import { RequestMethod } from '../RequestMethod.ts';

/**
 * Add every request method to the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[Any]`.
 */
export function Any() {
    return RequestMethod(...allRequestMethods());
}

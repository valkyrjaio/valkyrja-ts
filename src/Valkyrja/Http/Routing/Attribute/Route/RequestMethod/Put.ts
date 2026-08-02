/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { RequestMethod as RequestMethodEnum } from '../../../../Message/Enum/RequestMethod.ts';
import { RequestMethod } from '../RequestMethod.ts';

/**
 * Add the PUT request method to the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[Put]`.
 */
export function Put() {
    return RequestMethod(RequestMethodEnum.PUT);
}

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.ts';

import type { HttpRoutingThrowable } from '../../Contract/HttpRoutingThrowable.ts';

export abstract class HttpRoutingInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpRoutingThrowable {}

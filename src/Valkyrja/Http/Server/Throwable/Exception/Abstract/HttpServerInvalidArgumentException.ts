/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.ts';

import type { HttpServerThrowable } from '../../Contract/HttpServerThrowable.ts';

export abstract class HttpServerInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpServerThrowable {}

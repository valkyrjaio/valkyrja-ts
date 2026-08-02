/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.ts';

import type { HttpRoutingThrowable } from '../../Contract/HttpRoutingThrowable.ts';

export abstract class HttpRoutingRuntimeException extends HttpRuntimeException implements HttpRoutingThrowable {}

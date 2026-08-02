/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HttpMessageThrowable } from '../../Contract/HttpMessageThrowable.ts';
import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.ts';

export abstract class HttpMessageRuntimeException extends HttpRuntimeException implements HttpMessageThrowable {}

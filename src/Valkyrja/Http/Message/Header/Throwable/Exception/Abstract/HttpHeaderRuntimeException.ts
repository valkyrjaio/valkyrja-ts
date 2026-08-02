/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HttpHeaderThrowable } from '../../Contract/HttpHeaderThrowable.ts';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.ts';

export abstract class HttpHeaderRuntimeException extends HttpMessageRuntimeException implements HttpHeaderThrowable {}
